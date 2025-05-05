import redis
import os
from datetime import datetime, timedelta
from typing import Tuple
import logging

logger = logging.getLogger(__name__)

class RateLimiter:
    def __init__(self):
        try:
            self.redis_client = redis.Redis(
                host=os.getenv("REDIS_HOST", "localhost"),
                port=int(os.getenv("REDIS_PORT", 6379)),
                db=0,
                socket_timeout=1,  # 1 second timeout
                socket_connect_timeout=1  # 1 second connect timeout
            )
            # Test connection
            self.redis_client.ping()
        except (redis.ConnectionError, redis.TimeoutError) as e:
            logger.warning(f"Redis connection failed: {e}. Falling back to in-memory rate limiting.")
            self.redis_client = None
        
        self.max_attempts = int(os.getenv("MAX_FREE_ATTEMPTS", 3))
        self.window_seconds = int(os.getenv("RATE_LIMIT_WINDOW", 86400))
        self._in_memory_attempts = {}  # Fallback storage

    def check_limit(self, ip: str) -> bool:
        """Check if IP has exceeded rate limit"""
        if self.redis_client is None:
            return self._check_in_memory_limit(ip)
            
        try:
            key = f"free_resume_attempts:{ip}"
            attempts = self.redis_client.get(key)
            
            if attempts is None:
                self.redis_client.setex(key, self.window_seconds, 1)
                return True
            
            attempts = int(attempts)
            if attempts >= self.max_attempts:
                return False
            
            self.redis_client.incr(key)
            return True
        except (redis.ConnectionError, redis.TimeoutError) as e:
            logger.warning(f"Redis operation failed: {e}. Falling back to in-memory rate limiting.")
            return self._check_in_memory_limit(ip)

    def _check_in_memory_limit(self, ip: str) -> bool:
        """In-memory fallback for rate limiting"""
        now = datetime.now()
        if ip not in self._in_memory_attempts:
            self._in_memory_attempts[ip] = {
                'count': 1,
                'expires_at': now + timedelta(seconds=self.window_seconds)
            }
            return True

        entry = self._in_memory_attempts[ip]
        if now > entry['expires_at']:
            entry['count'] = 1
            entry['expires_at'] = now + timedelta(seconds=self.window_seconds)
            return True

        if entry['count'] >= self.max_attempts:
            return False

        entry['count'] += 1
        return True

    def get_attempts_remaining(self, ip: str) -> Tuple[int, int]:
        """Get remaining attempts and reset time for an IP"""
        if self.redis_client is None:
            return self._get_in_memory_attempts_remaining(ip)
            
        try:
            key = f"free_resume_attempts:{ip}"
            attempts = self.redis_client.get(key)
            
            if attempts is None:
                return self.max_attempts, 0
            
            attempts = int(attempts)
            ttl = self.redis_client.ttl(key)
            remaining = max(0, self.max_attempts - attempts)
            
            return remaining, ttl
        except (redis.ConnectionError, redis.TimeoutError) as e:
            logger.warning(f"Redis operation failed: {e}. Falling back to in-memory rate limiting.")
            return self._get_in_memory_attempts_remaining(ip)

    def _get_in_memory_attempts_remaining(self, ip: str) -> Tuple[int, int]:
        """In-memory fallback for getting attempts remaining"""
        now = datetime.now()
        if ip not in self._in_memory_attempts:
            return self.max_attempts, 0

        entry = self._in_memory_attempts[ip]
        if now > entry['expires_at']:
            return self.max_attempts, 0

        remaining = max(0, self.max_attempts - entry['count'])
        reset_time = int((entry['expires_at'] - now).total_seconds())
        return remaining, reset_time

    def get_attempts(self, ip: str) -> Tuple[int, int]:
        """Get current attempts and reset time for an IP"""
        key = f"resume_attempts:{ip}"
        attempts = self.redis_client.get(key)
        
        if attempts is None:
            return 0, 0
        
        ttl = self.redis_client.ttl(key)
        return int(attempts), ttl

    def increment_attempts(self, ip: str) -> bool:
        """Increment attempts for an IP, returns True if within limit"""
        key = f"resume_attempts:{ip}"
        attempts = self.redis_client.get(key)
        
        if attempts is None:
            self.redis_client.setex(key, self.window_seconds, 1)
            return True
        
        attempts = int(attempts)
        if attempts >= self.max_attempts:
            return False
        
        self.redis_client.incr(key)
        return True

    def reset_attempts(self, ip: str) -> None:
        """Reset attempts for an IP"""
        key = f"resume_attempts:{ip}"
        self.redis_client.delete(key) 
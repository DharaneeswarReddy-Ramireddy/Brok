import redis
import os
from datetime import datetime, timedelta
from typing import Tuple

class RateLimiter:
    def __init__(self):
        self.redis_client = redis.Redis(
            host=os.getenv("REDIS_HOST", "localhost"),
            port=int(os.getenv("REDIS_PORT", 6379)),
            db=0
        )
        self.max_attempts = int(os.getenv("MAX_FREE_ATTEMPTS", 3))  # Changed to be specific to free tier
        self.window_seconds = int(os.getenv("RATE_LIMIT_WINDOW", 86400))  # 24 hours

    def check_limit(self, ip: str) -> bool:
        """Check if IP has exceeded rate limit"""
        key = f"free_resume_attempts:{ip}"  # Changed key to be specific to free tier
        attempts = self.redis_client.get(key)
        
        if attempts is None:
            self.redis_client.setex(key, self.window_seconds, 1)
            return True
        
        attempts = int(attempts)
        if attempts >= self.max_attempts:
            return False
        
        self.redis_client.incr(key)
        return True

    def get_attempts_remaining(self, ip: str) -> Tuple[int, int]:
        """Get remaining attempts and reset time for an IP"""
        key = f"free_resume_attempts:{ip}"
        attempts = self.redis_client.get(key)
        
        if attempts is None:
            return self.max_attempts, 0
        
        attempts = int(attempts)
        ttl = self.redis_client.ttl(key)
        remaining = max(0, self.max_attempts - attempts)
        
        return remaining, ttl

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
import redis
import os
from typing import Tuple, Dict
import logging
import time

logger = logging.getLogger(__name__)

class RateLimiter:
    def __init__(self, max_attempts: int = 3, window_seconds: int = 3600):
        self.max_attempts = max_attempts
        self.window_seconds = window_seconds
        self.redis_client = None
        self.in_memory_storage: Dict[str, Dict[str, int]] = {}
        
        # Try to connect to Redis if available
        redis_url = os.getenv("REDIS_URL")
        if redis_url:
            try:
                self.redis_client = redis.from_url(redis_url)
                self.redis_client.ping()  # Test connection
            except Exception as e:
                logging.warning(f"Failed to connect to Redis: {str(e)}. Falling back to in-memory storage.")
                self.redis_client = None

    def check_limit(self, client_id: str) -> bool:
        """Check if the client has exceeded the rate limit"""
        current_time = int(time.time())
        
        if self.redis_client:
            try:
                # Get current attempts from Redis
                attempts = self.redis_client.get(f"attempts:{client_id}")
                if attempts:
                    attempts = int(attempts)
                    if attempts >= self.max_attempts:
                        return False
                    self.redis_client.incr(f"attempts:{client_id}")
                else:
                    self.redis_client.set(f"attempts:{client_id}", 1, ex=self.window_seconds)
                return True
            except Exception as e:
                logging.warning(f"Redis operation failed: {str(e)}. Falling back to in-memory storage.")
                self.redis_client = None

        # Fallback to in-memory storage
        if client_id not in self.in_memory_storage:
            self.in_memory_storage[client_id] = {
                "attempts": 1,
                "window_start": current_time
            }
            return True

        client_data = self.in_memory_storage[client_id]
        if current_time - client_data["window_start"] > self.window_seconds:
            # Reset window if expired
            client_data["attempts"] = 1
            client_data["window_start"] = current_time
            return True

        if client_data["attempts"] >= self.max_attempts:
            return False

        client_data["attempts"] += 1
        return True

    def get_attempts_remaining(self, client_id: str) -> Tuple[int, int]:
        """Get remaining attempts and reset time for a client"""
        current_time = int(time.time())
        
        if self.redis_client:
            try:
                attempts = self.redis_client.get(f"attempts:{client_id}")
                if attempts:
                    attempts = int(attempts)
                    ttl = self.redis_client.ttl(f"attempts:{client_id}")
                    return max(0, self.max_attempts - attempts), ttl
                return self.max_attempts, 0
            except Exception as e:
                logging.warning(f"Redis operation failed: {str(e)}. Falling back to in-memory storage.")
                self.redis_client = None

        # Fallback to in-memory storage
        if client_id not in self.in_memory_storage:
            return self.max_attempts, 0

        client_data = self.in_memory_storage[client_id]
        if current_time - client_data["window_start"] > self.window_seconds:
            return self.max_attempts, 0

        remaining = max(0, self.max_attempts - client_data["attempts"])
        reset_time = max(0, self.window_seconds - (current_time - client_data["window_start"]))
        return remaining, reset_time

    def reset_limit(self, client_id: str) -> None:
        """Reset the rate limit for a client"""
        if self.redis_client:
            try:
                self.redis_client.delete(f"attempts:{client_id}")
            except Exception as e:
                logging.warning(f"Redis operation failed: {str(e)}. Falling back to in-memory storage.")
                self.redis_client = None

        if client_id in self.in_memory_storage:
            del self.in_memory_storage[client_id] 
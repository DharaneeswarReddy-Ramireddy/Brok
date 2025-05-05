from pydantic import BaseModel
from typing import List, Dict, Optional

class ResumeData(BaseModel):
    content: str
    job_title: Optional[str] = None
    industry: Optional[str] = None
    experience_level: Optional[str] = None

class OptimizationResult(BaseModel):
    score: float
    suggestions: List[str]
    keywords: List[str]
    improvements: Dict[str, float]
    ats_score: Optional[float] = None
    readability_score: Optional[float] = None

class RateLimitResponse(BaseModel):
    attempts_remaining: int
    reset_time: Optional[int] = None  # Time in seconds until rate limit resets
    max_attempts: Optional[int] = 3  # Maximum number of attempts allowed in free tier 
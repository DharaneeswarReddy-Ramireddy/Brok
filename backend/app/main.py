from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from .models import ResumeData, OptimizationResult, RateLimitResponse
from .services.resume_optimizer import ResumeOptimizer
from .services.rate_limiter import RateLimiter
import logging

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
resume_optimizer = ResumeOptimizer()
rate_limiter = RateLimiter()

@app.post("/api/analyze-resume", response_model=OptimizationResult)
async def analyze_resume(resume_data: ResumeData, request: Request):
    """Analyze and optimize a resume"""
    try:
        # Check rate limit
        client_ip = request.client.host
        if not rate_limiter.check_limit(client_ip):
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        
        # Analyze resume
        result = resume_optimizer.analyze_resume(resume_data)
        return result
        
    except Exception as e:
        logging.error(f"Error analyzing resume: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/rate-limit", response_model=RateLimitResponse)
async def get_rate_limit(request: Request):
    """Get rate limit information"""
    try:
        client_ip = request.client.host
        remaining, reset_time = rate_limiter.get_attempts_remaining(client_ip)
        return RateLimitResponse(
            remaining_attempts=remaining,
            reset_time=reset_time,
            max_attempts=rate_limiter.max_attempts
        )
    except Exception as e:
        logging.error(f"Error getting rate limit: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 
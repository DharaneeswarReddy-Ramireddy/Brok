from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from .models import ResumeData, OptimizationResult, RateLimitResponse
from .services.resume_optimizer import ResumeOptimizer
from .services.rate_limiter import RateLimiter
from typing import Dict

app = FastAPI(title="Resume Optimizer API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
optimizer = ResumeOptimizer()
rate_limiter = RateLimiter()

def get_client_ip(request: Request) -> str:
    """Get client IP address from request"""
    if "X-Forwarded-For" in request.headers:
        return request.headers["X-Forwarded-For"].split(",")[0]
    return request.client.host

@app.post("/try-free/analyze", response_model=OptimizationResult)
async def analyze_resume_free(request: Request, resume_data: ResumeData) -> OptimizationResult:
    """Free tier endpoint for resume optimization"""
    ip = get_client_ip(request)
    
    if not rate_limiter.check_limit(ip):
        raise HTTPException(
            status_code=429,
            detail="Free tier limit exceeded. Please upgrade to continue optimizing resumes."
        )
    
    try:
        result = optimizer.analyze_resume(resume_data)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing resume: {str(e)}"
        )

@app.get("/try-free/attempts", response_model=RateLimitResponse)
async def get_free_attempts_remaining(request: Request) -> RateLimitResponse:
    """Get remaining free attempts for an IP"""
    ip = get_client_ip(request)
    remaining, reset_time = rate_limiter.get_attempts_remaining(ip)
    return RateLimitResponse(
        attempts_remaining=remaining,
        reset_time=reset_time
    )

@app.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint"""
    return {"status": "healthy"} 
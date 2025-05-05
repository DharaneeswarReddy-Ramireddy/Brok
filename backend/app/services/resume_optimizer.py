from typing import List, Dict
from ..models import ResumeData, OptimizationResult
from .ai_optimizer import AIOptimizer

class ResumeOptimizer:
    def __init__(self):
        self.ai_optimizer = AIOptimizer()

    def analyze_resume(self, resume_data: ResumeData) -> OptimizationResult:
        """Analyze and optimize the resume using Azure OpenAI"""
        try:
            # Get comprehensive analysis from Azure OpenAI
            analysis_result = self.ai_optimizer.analyze_resume(
                resume_data.content,
                resume_data.job_title or "",
                resume_data.industry or ""
            )
            
            # Get optimized version with improvements
            optimization_result = self.ai_optimizer.optimize_resume(
                resume_data.content,
                resume_data.job_title or "",
                analysis_result["ats_score"]
            )
            
            return OptimizationResult(
                score=analysis_result["ats_score"],
                suggestions=analysis_result["suggestions"],
                keywords=analysis_result["keywords"],
                improvements={
                    "formatting": analysis_result["formatting_score"],
                    "content": analysis_result["content_score"],
                    "keywords": analysis_result["keyword_score"],
                    "readability": analysis_result["readability_score"]
                },
                ats_score=analysis_result["ats_score"],
                readability_score=analysis_result["readability_score"],
                optimized_resume=optimization_result["optimized_resume"],
                improvements_made=optimization_result["improvements"],
                further_suggestions=optimization_result["suggestions"]
            )
        except Exception as e:
            raise Exception(f"Error in resume analysis: {str(e)}") 
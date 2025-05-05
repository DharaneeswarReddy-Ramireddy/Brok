import os
from openai import AzureOpenAI
from typing import Dict, Any, List
import re

class AIOptimizer:
    def __init__(self):
        self.client = None
        self.model = os.getenv("AZURE_OPENAI_DEPLOYMENT", "o3-mini")
        
        # Try to initialize Azure OpenAI client if credentials are available
        api_key = os.getenv("AZURE_OPENAI_API_KEY")
        endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")
        
        if api_key and endpoint:
            try:
                self.client = AzureOpenAI(
                    api_version=api_version,
                    azure_endpoint=endpoint,
                    api_key=api_key,
                )
            except Exception as e:
                print(f"Warning: Failed to initialize Azure OpenAI client: {str(e)}")

    def analyze_resume(self, resume_content: str, job_title: str, industry: str) -> Dict[str, Any]:
        """Analyze resume using Azure OpenAI"""
        if not self.client:
            return {
                "ats_score": 0.0,
                "formatting_score": 0.0,
                "content_score": 0.0,
                "keyword_score": 0.0,
                "readability_score": 0.0,
                "suggestions": ["AI analysis is currently unavailable. Please try again later."],
                "keywords": []
            }

        system_prompt = """You are an expert resume analyzer and ATS optimization specialist.
        Your task is to analyze the given resume and provide detailed feedback on:
        1. ATS compatibility and score
        2. Formatting and structure
        3. Content quality and impact
        4. Keyword optimization
        5. Readability and professional tone

        Provide your analysis in the following format:
        ATS Score: [0-100]
        Formatting Score: [0-100]
        Content Score: [0-100]
        Keyword Score: [0-100]
        Readability Score: [0-100]
        Suggestions: [list of specific improvement suggestions]
        Keywords: [list of relevant keywords found]
        """

        user_prompt = f"""Job Title: {job_title}
        Industry: {industry}

        Resume Content:
        {resume_content}

        Please analyze this resume and provide detailed feedback in the specified format.
        """

        try:
            response = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_completion_tokens=2000,
                model=self.model
            )

            analysis_text = response.choices[0].message.content
            
            # Parse the analysis text
            scores = {
                "ats_score": float(re.search(r"ATS Score: (\d+)", analysis_text).group(1)),
                "formatting_score": float(re.search(r"Formatting Score: (\d+)", analysis_text).group(1)),
                "content_score": float(re.search(r"Content Score: (\d+)", analysis_text).group(1)),
                "keyword_score": float(re.search(r"Keyword Score: (\d+)", analysis_text).group(1)),
                "readability_score": float(re.search(r"Readability Score: (\d+)", analysis_text).group(1))
            }
            
            suggestions_match = re.search(r"Suggestions: (.*?)(?=Keywords:|$)", analysis_text, re.DOTALL)
            suggestions = [s.strip() for s in suggestions_match.group(1).split("\n") if s.strip()] if suggestions_match else []
            
            keywords_match = re.search(r"Keywords: (.*?)$", analysis_text, re.DOTALL)
            keywords = [k.strip() for k in keywords_match.group(1).split(",")] if keywords_match else []
            
            return {
                **scores,
                "suggestions": suggestions,
                "keywords": keywords
            }

        except Exception as e:
            print(f"Error analyzing resume: {str(e)}")
            return {
                "ats_score": 0.0,
                "formatting_score": 0.0,
                "content_score": 0.0,
                "keyword_score": 0.0,
                "readability_score": 0.0,
                "suggestions": ["AI analysis failed. Please try again later."],
                "keywords": []
            }

    def optimize_resume(self, resume_content: str, job_description: str, ats_score: float) -> Dict[str, Any]:
        """Optimize resume using Azure OpenAI"""
        if not self.client:
            return {
                "optimized_resume": resume_content,
                "improvements": ["AI optimization is currently unavailable. Please try again later."],
                "suggestions": ["AI optimization is currently unavailable. Please try again later."],
                "ats_score": ats_score
            }

        system_prompt = """You are an expert resume writer and ATS optimization specialist. 
        Your task is to optimize the given resume to better match the job description while maintaining 
        the candidate's experience and qualifications. Focus on:
        1. Improving ATS compatibility
        2. Matching keywords from the job description
        3. Enhancing action verbs and quantifiable achievements
        4. Maintaining professional tone and formatting
        5. Improving overall impact and readability

        Provide your optimization in the following format:
        Optimized Resume:
        [optimized resume content]

        Improvements Made:
        [list of specific improvements made]

        Further Suggestions:
        [list of additional suggestions for improvement]
        """

        user_prompt = f"""Current ATS Score: {ats_score}%

        Job Description:
        {job_description}

        Current Resume:
        {resume_content}

        Please provide an optimized version of this resume with detailed improvements and suggestions.
        """

        try:
            response = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_completion_tokens=4000,
                model=self.model
            )

            optimized_content = response.choices[0].message.content
            
            # Extract the optimized resume and suggestions
            optimized_resume_match = re.search(r"Optimized Resume:\s*(.*?)(?=Improvements Made:|$)", optimized_content, re.DOTALL)
            improvements_match = re.search(r"Improvements Made:\s*(.*?)(?=Further Suggestions:|$)", optimized_content, re.DOTALL)
            suggestions_match = re.search(r"Further Suggestions:\s*(.*?)$", optimized_content, re.DOTALL)
            
            optimized_resume = optimized_resume_match.group(1).strip() if optimized_resume_match else resume_content
            improvements = [i.strip() for i in improvements_match.group(1).split("\n") if i.strip()] if improvements_match else []
            suggestions = [s.strip() for s in suggestions_match.group(1).split("\n") if s.strip()] if suggestions_match else []

            return {
                "optimized_resume": optimized_resume,
                "improvements": improvements,
                "suggestions": suggestions,
                "ats_score": ats_score
            }

        except Exception as e:
            print(f"Error optimizing resume: {str(e)}")
            return {
                "optimized_resume": resume_content,
                "improvements": ["AI optimization failed. Please try again later."],
                "suggestions": ["AI optimization failed. Please try again later."],
                "ats_score": ats_score
            } 
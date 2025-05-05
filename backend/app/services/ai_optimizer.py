import os
from openai import AzureOpenAI
from typing import Dict, Any

class AIOptimizer:
    def __init__(self):
        self.client = AzureOpenAI(
            api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-12-01-preview"),
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        )
        self.model = os.getenv("AZURE_OPENAI_DEPLOYMENT", "o3-mini")

    def optimize_resume(self, resume_content: str, job_description: str, ats_score: float) -> Dict[str, Any]:
        """Optimize resume using Azure OpenAI"""
        system_prompt = """You are an expert resume writer and ATS optimization specialist. 
        Your task is to optimize the given resume to better match the job description while maintaining 
        the candidate's experience and qualifications. Focus on:
        1. Improving ATS compatibility
        2. Matching keywords from the job description
        3. Enhancing action verbs and quantifiable achievements
        4. Maintaining professional tone and formatting
        """

        user_prompt = f"""Current ATS Score: {ats_score}%

        Job Description:
        {job_description}

        Current Resume:
        {resume_content}

        Please provide:
        1. An optimized version of the resume
        2. A list of key improvements made
        3. Specific suggestions for further enhancement
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
            sections = optimized_content.split("\n\n")
            optimized_resume = sections[0] if sections else ""
            improvements = sections[1] if len(sections) > 1 else ""
            suggestions = sections[2] if len(sections) > 2 else ""

            return {
                "optimized_resume": optimized_resume,
                "improvements": improvements,
                "suggestions": suggestions,
                "ats_score": ats_score
            }

        except Exception as e:
            raise Exception(f"Error optimizing resume: {str(e)}") 
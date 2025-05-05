import { ResumeAnalysisResult, RateLimitInfo } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function analyzeResumeFree(resumeContent: string, jobTitle?: string, industry?: string): Promise<ResumeAnalysisResult> {
    const response = await fetch(`${API_BASE_URL}/try-free/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: resumeContent,
            job_title: jobTitle,
            industry: industry,
        }),
    });

    if (!response.ok) {
        if (response.status === 429) {
            throw new Error('Free tier limit reached. Please upgrade to continue.');
        }
        throw new Error('Failed to analyze resume');
    }

    return response.json();
}

export async function getFreeAttemptsRemaining(): Promise<RateLimitInfo> {
    const response = await fetch(`${API_BASE_URL}/try-free/attempts`);

    if (!response.ok) {
        throw new Error('Failed to get remaining attempts');
    }

    return response.json();
} 
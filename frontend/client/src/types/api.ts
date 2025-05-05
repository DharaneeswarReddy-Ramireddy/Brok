export interface ResumeAnalysisResult {
    score: number;
    suggestions: string[];
    keywords: string[];
    improvements: {
        [key: string]: number;
    };
    ats_score?: number;
    readability_score?: number;
}

export interface RateLimitInfo {
    attempts_remaining: number;
    reset_time?: number;
    max_attempts?: number;
} 
/**
 * Interface for ATS score result
 */
export interface ATSScoreResult {
  score: number;
  keywords: {
    keyword: string;
    matches: number;
    found: boolean;
  }[];
  suggestions: {
    category: string;
    items: string[];
  }[];
}

/**
 * Submit resume and job description for ATS scoring
 */
export async function submitForATSScoring(
  resumeId: number | null,
  jobDescription: string
): Promise<ATSScoreResult> {
  if (!resumeId) {
    throw new Error("Resume ID is required");
  }
  try {
    const response = await fetch("/api/resume/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resumeId,
        jobDescription,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze resume");
    }

    return await response.json();
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
}

/**
 * Get score color based on the score value
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
}

/**
 * Format score as a percentage
 */
export function formatScore(score: number): string {
  return `${score}%`;
}

/**
 * Get a description of the score
 */
export function getScoreDescription(score: number): string {
  if (score >= 80) {
    return "Excellent! Your resume is highly optimized for this job description.";
  } else if (score >= 60) {
    return "Good, but there's room for improvement to make your resume more ATS-friendly.";
  } else {
    return "Your resume needs significant improvements to pass ATS systems for this job.";
  }
}

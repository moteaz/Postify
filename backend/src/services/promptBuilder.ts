export class PromptBuilder {
    static buildCoverLetterPrompt(
        jobDescription: string,
        cvText: string,
        userName: string,
        language: string
    ): string {
        return `
You are an expert career coach and professional writer. 
Analyze the following job description and candidate's CV.

Job Description:
"""
${jobDescription}
"""

Candidate's CV (text extract):
"""
${cvText}
"""

Candidate's Name: ${userName}
Language to respond in: ${language}

Task:
1. Write a professional, tailored cover letter (max 350 words, formal tone).
2. Create a concise, compelling email subject line for the job application.
3. Extract the recruiter's email address if found in the job description.

Respond ONLY in valid JSON format with the following keys:
{
  "coverLetter": "...",
  "subject": "...",
  "recruiterEmail": "..." or null
}`;
    }
}

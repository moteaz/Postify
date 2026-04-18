export class PromptBuilder {
  static buildCoverLetterPrompt(
    jobDescription: string,
    cvText: string,
    userName: string,
    language: string,
    userContacts: Array<{ type: string; value: string }> = []
  ): string {
    // Format contacts for prompt
    const contactsSection = userContacts.length > 0
      ? `\n\nCandidate's Contact Information:\n${userContacts.map(c => `${c.type}: ${c.value}`).join('\n')}`
      : '';

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
Candidate Contact Info (if available): ${contactsSection}
Language to respond in: ${language}

Task:
1. Write a professional, tailored cover letter (max 150 words, formal tone).
- Do NOT include the subject line inside the cover letter.
- If contact info is provided, add it at the END .
2. Create a concise, compelling email subject line for the job application.
3. Extract the recruiter's email address if found in the job description.

Respond ONLY in valid JSON format with the following keys:
- Do NOT add any extra text outside JSON.
- Ensure the "coverLetter" field contains ONLY the clean letter text with contact info at the end.
{
  "coverLetter": "...",
  "subject": "...",
  "recruiterEmail": "..." or null
}`;
  }
}

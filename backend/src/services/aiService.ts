import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Configure AI Client based on provider
 */
const getAIClient = () => {
    const provider = process.env.AI_PROVIDER || 'openai';

    if (provider === 'ollama') {
        return new OpenAI({
            baseURL: `${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}/v1`,
            apiKey: 'ollama', // Ollama doesn't require a real key
        });
    }

    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
};

const aiClient = getAIClient();
const model = process.env.AI_PROVIDER === 'ollama'
    ? (process.env.OLLAMA_MODEL || 'llama3')
    : 'gpt-4o';

export interface GenerationResult {
    coverLetter: string;
    subject: string;
    recruiterEmail: string | null;
}

/**
 * Generates application content using chosen LLM (Ollama or OpenAI)
 */
export const generateApplicationContent = async (
    jobDescription: string,
    cvText: string,
    userName: string,
    language: string = 'English'
): Promise<GenerationResult> => {
    const prompt = `
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
    }
  `;

    const response = await aiClient.chat.completions.create({
        model: model,
        messages: [
            { role: 'system', content: 'You are a professional recruiting assistant. You always respond in valid JSON.' },
            { role: 'user', content: prompt }
        ],
        // Only OpenAI supports strict json_object mode; Ollama/Llama 3 works better with clear prompt instructions
        response_format: process.env.AI_PROVIDER === 'openai' ? { type: 'json_object' } : undefined,
        temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('AI generation returned empty content');

    // If Ollama returns Markdown-wrapped JSON (common), clean it up
    const cleanContent = content.startsWith('```json')
        ? content.replace(/```json|```/g, '').trim()
        : content.trim();

    try {
        return JSON.parse(cleanContent) as GenerationResult;
    } catch (e) {
        console.error('Failed to parse AI JSON response:', cleanContent);
        throw new Error('AI returned invalid JSON format');
    }
};

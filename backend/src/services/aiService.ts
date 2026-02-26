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
            apiKey: 'ollama',
        });
    }

    if (provider === 'openrouter') {
        return new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: process.env.OPENROUTER_API_KEY,
            defaultHeaders: {
                'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:3000',
                'X-Title': 'Postify',
            }
        });
    }

    if (provider === 'huggingface') {
        return new OpenAI({
            baseURL: 'https://router.huggingface.co/v1',
            apiKey: process.env.HF_TOKEN,
        });
    }

    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
};

const aiClient = getAIClient();
const getModel = () => {
    const provider = process.env.AI_PROVIDER || 'openai';
    if (provider === 'ollama') return process.env.OLLAMA_MODEL || 'llama3';
    if (provider === 'openrouter') return process.env.OPENROUTER_MODEL || 'anthropic/claude-3-haiku';
    if (provider === 'huggingface') return process.env.HF_MODEL || 'deepseek-ai/DeepSeek-R1:novita';
    return process.env.OPENAI_MODEL || 'gpt-4o';
};

const model = getModel();

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

    console.log(`[AI] Generating with provider: ${process.env.AI_PROVIDER || 'openai'}, model: ${model}`);

    try {
        const response = await aiClient.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: 'You are a professional recruiting assistant. You always respond in valid JSON.' },
                { role: 'user', content: prompt }
            ],
            response_format: process.env.AI_PROVIDER === 'openai' ? { type: 'json_object' } : undefined,
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error('AI generation returned empty content');

        console.log('[AI] Raw Response:', content);

        // Robust JSON extraction: Find the first { and the last }
        const start = content.indexOf('{');
        const end = content.lastIndexOf('}');

        if (start === -1 || end === -1) {
            console.error('[AI] No JSON found in response');
            throw new Error('AI response did not contain a valid JSON object');
        }

        const cleanContent = content.substring(start, end + 1).trim();

        try {
            return JSON.parse(cleanContent) as GenerationResult;
        } catch (e) {
            console.error('[AI] JSON Parse Error:', e);
            console.error('[AI] Attempted to parse:', cleanContent);
            throw new Error('AI returned malformed JSON');
        }
    } catch (error: any) {
        console.error('[AI] Generation Exception:', error);

        if (error.code === 'ECONNREFUSED') {
            throw new Error(`Connection refused to AI provider. Is ${process.env.AI_PROVIDER === 'ollama' ? 'Ollama' : 'OpenAI'} running at ${process.env.OLLAMA_BASE_URL}?`);
        }

        if (error.status === 404 && process.env.AI_PROVIDER === 'ollama') {
            throw new Error(`Model '${model}' not found in Ollama. Run 'ollama pull ${model}' in your terminal.`);
        }

        throw new Error(`AI Provider Error: ${error.message}`);
    }
};

import OpenAI from 'openai';
import dotenv from 'dotenv';
import { logger } from '../infrastructure/logging/logger.js';
import { PromptBuilder } from './promptBuilder.js';
import { AIGenerationError } from '../utils/customErrors.js';
import { PROVIDERS } from '../config/index.js';

dotenv.config();

const getAIClient = () => {
    const provider = process.env.AI_PROVIDER || PROVIDERS.OPENAI;

    if (provider === PROVIDERS.OLLAMA) {
        return new OpenAI({
            baseURL: `${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}/v1`,
            apiKey: 'ollama',
        });
    }

    if (provider === PROVIDERS.OPENROUTER) {
        return new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: process.env.OPENROUTER_API_KEY,
            defaultHeaders: {
                'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:3000',
                'X-Title': 'Postify',
            }
        });
    }

    if (provider === PROVIDERS.HUGGINGFACE) {
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
    const provider = process.env.AI_PROVIDER || PROVIDERS.OPENAI;
    if (provider === PROVIDERS.OLLAMA) return process.env.OLLAMA_MODEL || 'llama3';
    if (provider === PROVIDERS.OPENROUTER) return process.env.OPENROUTER_MODEL || 'anthropic/claude-3-haiku';
    if (provider === PROVIDERS.HUGGINGFACE) return process.env.HF_MODEL || 'deepseek-ai/DeepSeek-R1:novita';
    return process.env.OPENAI_MODEL || 'gpt-4o';
};

const model = getModel();

export interface GenerationResult {
    coverLetter: string;
    subject: string;
    recruiterEmail: string | null;
}

export const generateApplicationContent = async (
    jobDescription: string,
    cvText: string,
    userName: string,
    language: string = 'English'
): Promise<GenerationResult> => {
    const prompt = PromptBuilder.buildCoverLetterPrompt(jobDescription, cvText, userName, language);

    logger.info('Generating with provider', { provider: process.env.AI_PROVIDER || 'openai', model });

    try {
        const response = await aiClient.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: 'You are a professional recruiting assistant. You always respond in valid JSON.' },
                { role: 'user', content: prompt }
            ],
            response_format: process.env.AI_PROVIDER === PROVIDERS.OPENAI ? { type: 'json_object' } : undefined,
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error('AI generation returned empty content');

        logger.info('Raw Response received');

        const start = content.indexOf('{');
        const end = content.lastIndexOf('}');

        if (start === -1 || end === -1) {
            logger.error('No JSON found in response');
            throw new Error('AI response did not contain a valid JSON object');
        }

        const cleanContent = content.substring(start, end + 1).trim();

        try {
            return JSON.parse(cleanContent) as GenerationResult;
        } catch (e) {
            logger.error('JSON Parse Error', { preview: cleanContent.substring(0, 200) });
            throw new Error('AI returned malformed JSON');
        }
    } catch (error: any) {
        logger.error('Generation Exception', { message: error.message });

        if (error.code === 'ECONNREFUSED') {
            throw new AIGenerationError(`Connection refused to AI provider. Is ${process.env.AI_PROVIDER === PROVIDERS.OLLAMA ? 'Ollama' : 'OpenAI'} running at ${process.env.OLLAMA_BASE_URL}?`);
        }

        if (error.status === 404 && process.env.AI_PROVIDER === PROVIDERS.OLLAMA) {
            throw new AIGenerationError(`Model '${model}' not found in Ollama. Run 'ollama pull ${model}' in your terminal.`);
        }

        throw new AIGenerationError(`AI Provider Error: ${error.message}`);
    }
};

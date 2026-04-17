import OpenAI from 'openai';
import dotenv from 'dotenv';
import { logger } from '../infrastructure/logging/logger.js';
import { PromptBuilder } from './promptBuilder.js';
import { AIGenerationError } from '../utils/errors.js';
import { PROVIDERS } from '../config/constants.js';

dotenv.config();

const getAIClient = (): OpenAI => {
  const provider = process.env.AI_PROVIDER || PROVIDERS.OPENAI;

  if (provider === PROVIDERS.OPENROUTER) {
    return new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:3000',
        'X-Title': 'Postify',
      },
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
const getModel = (): string => {
  const provider = process.env.AI_PROVIDER || PROVIDERS.OPENAI;
  if (provider === PROVIDERS.OPENROUTER)
    return process.env.OPENROUTER_MODEL || 'anthropic/claude-3-haiku';
  if (provider === PROVIDERS.HUGGINGFACE)
    return process.env.HF_MODEL || 'deepseek-ai/DeepSeek-R1:novita';
  return process.env.OPENAI_MODEL || 'gpt-4o';
};

const model = getModel();

export interface GenerationResult {
  coverLetter: string;
  subject: string;
  recruiterEmail: string | null;
}

export interface UserContact {
  type: string;
  value: string;
}

export const generateApplicationContent = async (
  jobDescription: string,
  cvText: string,
  userName: string,
  language: string = 'English',
  userContacts: UserContact[] = []
): Promise<GenerationResult> => {
  const prompt = PromptBuilder.buildCoverLetterPrompt(
    jobDescription,
    cvText,
    userName,
    language,
    userContacts
  );

  try {
    const response = await aiClient.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a professional recruiting assistant. You always respond in valid JSON.',
        },
        { role: 'user', content: prompt },
      ],
      response_format:
        process.env.AI_PROVIDER === PROVIDERS.OPENAI ? { type: 'json_object' } : undefined,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('AI generation returned empty content');

    const start = content.indexOf('{');
    const end = content.lastIndexOf('}');

    if (start === -1 || end === -1) {
      logger.error('No JSON found in response');
      throw new Error('AI response did not contain a valid JSON object');
    }

    const cleanContent = content.substring(start, end + 1).trim();

    try {
      return JSON.parse(cleanContent) as GenerationResult;
    } catch {
      logger.error('JSON Parse Error', { preview: cleanContent.substring(0, 200) });
      throw new Error('AI returned malformed JSON');
    }
  } catch (error) {
    logger.error('Generation Exception', { message: (error as Error).message });

    if ((error as { code?: string }).code === 'ECONNREFUSED') {
      throw new AIGenerationError(
        `Connection refused to AI provider. Check if the service is running.`
      );
    }

    if ((error as { status?: number }).status === 404) {
      throw new AIGenerationError(
        `Model '${model}' not found. Please check your AI provider configuration.`
      );
    }

    throw new AIGenerationError(`AI Provider Error: ${(error as Error).message}`);
  }
};

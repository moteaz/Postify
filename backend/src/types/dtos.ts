import { GenerationResult } from '../services/aiService.js';

export interface GenerateContentRequest {
  jobDescription: string;
}

export interface GenerateContentResponse {
  applicationId: string;
  content: GenerationResult;
}

export interface SendApplicationRequest {
  applicationId: string;
  to: string;
  subject: string;
  body: string;
}

export interface EmailConfig {
  to: string;
  subject: string;
  body: string;
  cvBuffer: Buffer;
  cvFileName: string;
  userEmail: string;
}

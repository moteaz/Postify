import { ApplicationStatus } from "./enums";

// Core domain types
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  cvs?: CV[];
}

export interface CV {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  isActive: boolean;
}

export interface Application {
  id: string;
  subject: string;
  recruiterEmail: string;
  coverLetter: string;
  status: ApplicationStatus;
  generatedAt: string;
  cv?: CV;
}

export interface GeneratedContent {
  recruiterEmail: string;
  subject: string;
  coverLetter: string;
}

// API Response types
export interface ApiError {
  message: string;
  details?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

export interface GenerateResponse extends ApiResponse<{
  content: GeneratedContent;
  applicationId: string;
}> {}

export interface HistoryResponse extends ApiResponse<{
  history: Application[];
}> {}

export interface CVResponse extends ApiResponse<{
  cvs: CV[];
}> {}

export interface MeResponse extends ApiResponse<{
  user: User;
}> {}

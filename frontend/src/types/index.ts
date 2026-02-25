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
  status: "DRAFT" | "SENT" | "FAILED";
  generatedAt: string;
  cv?: CV;
}

export interface GeneratedContent {
  recruiterEmail: string;
  subject: string;
  coverLetter: string;
}

export interface SystemStatus {
  api: "online" | "offline" | "checking";
  ai: "online" | "offline" | "checking";
  provider?: string;
}

// API Response types
export interface ApiError {
  message: string;
  details?: string;
}

export interface HealthResponse {
  ai_status: string;
  ai_provider: string;
}

export interface GenerateResponse {
  content: GeneratedContent;
  applicationId: string;
}

export interface HistoryResponse {
  history: Application[];
}

export interface CVResponse {
  cvs: CV[];
}

export interface MeResponse {
  user: User;
}

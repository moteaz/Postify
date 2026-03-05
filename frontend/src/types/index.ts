import { ApplicationStatus } from "./enums";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN"
}

// Core domain types
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
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

export interface AdminUser extends User {
  createdAt: string;
  _count: {
    cvs: number;
    applications: number;
  };
}

export interface AdminUserDetails extends User {
  createdAt: string;
  _count: {
    cvs: number;
    applications: number;
  };
  cvs: CV[];
  applications: PaginatedResponse<Application>;
}

export interface AdminUsersResponse extends ApiResponse<{
  users: AdminUser[];
}> {}

export interface AdminUserDetailsResponse extends ApiResponse<{
  user: AdminUserDetails;
}> {}

// Pagination types
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

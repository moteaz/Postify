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

export interface UserContact {
  id: string;
  type: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export const APP_NAME = "Postify";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  AUTH_CALLBACK: "/auth/callback",
} as const;

export const API_ENDPOINTS = {
  AUTH_ME: "/auth/me",
  AUTH_GOOGLE: "/auth/google",
  EMAIL_HISTORY: "/email/history",
  EMAIL_SEND: "/email/send",
  CV: "/cv",
  CV_UPLOAD: "/cv/upload",
  AI_GENERATE: "/ai/generate",
  HEALTH: "/health",
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: [".pdf", ".docx"],
} as const;

export const LIMITS = {
  DAILY_GENERATIONS: 20,
} as const;

export const STORAGE_KEYS = {
  AUTH: "postify-auth-storage",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
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

export const VALIDATION = {
  MAX_CV_SIZE_MB: 5,
  ALLOWED_CV_TYPES: ['.pdf', '.docx'],
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const MESSAGES = {
  CV_UPLOAD_SUCCESS: "CV uploaded successfully!",
  CV_DELETE_SUCCESS: "CV deleted.",
  CV_ACTIVE_SUCCESS: "Active CV updated!",
  APPLICATION_SENT_SUCCESS: "Application sent successfully!",
  NO_ACTIVE_CV: "No Active CV Found",
  NO_ACTIVE_CV_DESC: "You need an active CV for AI to tailor your application",
} as const;

export const TIMEOUTS = {
  TOAST_DURATION: 5000,
  SUCCESS_TOAST_DURATION: 3000,
} as const;

export const UI = {
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
} as const;
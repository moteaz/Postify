export const FILE_UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024,
    ALLOWED_TYPES: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ALLOWED_EXTENSIONS: ['.pdf', '.docx']
} as const;

export const JWT = {
    EXPIRY: '7d',
    COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000
} as const;

export const APPLICATION = {
    MIN_JOB_DESC_LENGTH: 50,
    MAX_JOB_DESC_LENGTH: 5000,
    MAX_COVER_LETTER_LENGTH: 10000
} as const;

export const RATE_LIMIT = {
    WINDOW_MS: 15 * 60 * 1000,
    MAX_REQUESTS: 100,
    AUTH_MAX: 5,
    UPLOAD_MAX: 10
} as const;

export const ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:5173'
];

import validator from 'validator';
import { ALLOWED_ORIGINS } from '../config/constants.js';

export const isValidEmail = (email: string): boolean => {
    return validator.isEmail(email, { 
        allow_utf8_local_part: false,
        require_tld: true 
    });
};

export const validateRedirectUrl = (url: string): string => {
    try {
        const parsed = new URL(url);
        if (ALLOWED_ORIGINS.includes(parsed.origin)) {
            return url;
        }
    } catch {}
    return ALLOWED_ORIGINS[0];
};

export const sanitizeFilename = (filename: string): string => {
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};

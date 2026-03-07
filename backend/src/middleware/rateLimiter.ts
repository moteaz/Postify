import rateLimit from 'express-rate-limit';
import { RATE_LIMIT } from '../config/constants.js';

export const generalLimiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  max: RATE_LIMIT.MAX_REQUESTS,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  max: RATE_LIMIT.AUTH_MAX,
  message: 'Too many login attempts, please try again later',
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: RATE_LIMIT.UPLOAD_MAX,
  message: 'Too many uploads, please try again later',
});

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { JWTPayload } from '../types/jwt.types.js';
import { JWT } from '../config/constants.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_change_me';

export const signToken = (userId: string): string => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT.EXPIRY });
};

export const verifyToken = (token: string): JWTPayload => {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
};

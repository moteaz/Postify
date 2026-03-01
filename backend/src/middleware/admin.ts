import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
import { UnauthorizedError } from '../utils/errors.js';

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        throw new UnauthorizedError('Admin access required');
    }
    next();
};

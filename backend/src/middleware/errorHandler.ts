import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        logger.error(`${err.statusCode} - ${err.message}`, {
            path: req.path,
            method: req.method
        });

        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    logger.error('Unhandled Error:', err.message);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error'
    });
};

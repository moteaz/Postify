import { Response } from 'express';

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

export class ResponseHandler {
    static success<T>(res: Response, data: T, message?: string, statusCode: number = 200) {
        const response: ApiResponse<T> = {
            success: true,
            message,
            data
        };
        return res.status(statusCode).json(response);
    }

    static error(res: Response, message: string, statusCode: number = 500) {
        const response: ApiResponse = {
            success: false,
            error: message
        };
        return res.status(statusCode).json(response);
    }
}

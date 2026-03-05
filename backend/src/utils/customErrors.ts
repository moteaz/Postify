export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public isOperational: boolean = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
    }
}

export class ValidationError extends AppError {
    constructor(message: string = 'Validation failed') {
        super(message, 400);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
    }
}

export class AIGenerationError extends AppError {
    constructor(message: string = 'AI generation failed') {
        super(message, 500);
    }
}

export class EmailSendError extends AppError {
    constructor(message: string = 'Email sending failed') {
        super(message, 500);
    }
}

export class TokenRefreshError extends AppError {
    constructor(message: string = 'Token refresh failed') {
        super(message, 401);
    }
}

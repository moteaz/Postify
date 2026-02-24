import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { prisma } from '../utils/prisma.js';

export interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let token;

        // Check for Bearer token in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Fallback to cookie
        else if (req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // Verify token
        const decoded = verifyToken(token);

        // Get user from DB
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                cvs: {
                    where: { isActive: true },
                    take: 1,
                },
            },
        });

        if (!user) {
            return res.status(401).json({ message: 'User no longer exists' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

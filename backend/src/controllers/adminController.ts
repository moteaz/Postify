import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../utils/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ResponseHandler } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
            role: true,
            createdAt: true,
            _count: {
                select: {
                    cvs: true,
                    applications: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return ResponseHandler.success(res, { users });
});

export const exportUsers = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const users = await prisma.user.findMany({
        select: {
            email: true,
            name: true,
            role: true,
            createdAt: true,
            _count: {
                select: {
                    cvs: true,
                    applications: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    const csv = [
        'Email,Name,Role,Joined,CVs,Applications',
        ...users.map(u => 
            `${u.email},${u.name || 'N/A'},${u.role},${new Date(u.createdAt).toLocaleDateString()},${u._count.cvs},${u._count.applications}`
        )
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=users-${Date.now()}.csv`);
    res.send(csv);
});

export const getUserDetails = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            cvs: {
                orderBy: { uploadedAt: 'desc' }
            },
            applications: {
                include: { cv: true },
                orderBy: { generatedAt: 'desc' }
            }
        }
    });

    if (!user) {
        throw new NotFoundError('User not found');
    }

    return ResponseHandler.success(res, { user });
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    if (id === req.user.id) {
        throw new ValidationError('Cannot delete your own account');
    }

    const user = await prisma.user.findUnique({ where: { id } });
    
    if (!user) {
        throw new NotFoundError('User not found');
    }

    if (user.role === 'ADMIN') {
        throw new ValidationError('Cannot delete admin users');
    }

    await prisma.user.delete({ where: { id } });

    // Activity log
    console.log(`[ADMIN ACTION] ${req.user.email} deleted user ${user.email} at ${new Date().toISOString()}`);

    return ResponseHandler.success(res, null, 'User deleted successfully');
});

export const downloadCV = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { cvId } = req.params;

    const cv = await prisma.userCV.findUnique({
        where: { id: cvId }
    });

    if (!cv) {
        throw new NotFoundError('CV not found');
    }

    const filePath = path.join(__dirname, '../../uploads', cv.fileKey);

    if (!fs.existsSync(filePath)) {
        throw new NotFoundError('CV file not found on server');
    }

    res.download(filePath, cv.fileName);
});

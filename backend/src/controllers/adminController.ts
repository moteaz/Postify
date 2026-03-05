import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../utils/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ResponseHandler } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { parsePagination, buildPaginationResult } from '../utils/pagination.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { skip, take, page } = parsePagination(req.query);

    const [users, total] = await prisma.$transaction([
        prisma.user.findMany({
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
            orderBy: { createdAt: 'desc' },
            skip,
            take
        }),
        prisma.user.count()
    ]);

    const result = buildPaginationResult(users, total, page, take);
    return ResponseHandler.success(res, result);
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
    const { skip, take, page } = parsePagination(req.query);

    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
            provider: true,
            providerAccountId: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            _count: {
                select: {
                    cvs: true,
                    applications: true
                }
            }
        }
    });

    if (!user) {
        throw new NotFoundError('User not found');
    }

    const [cvs, applications] = await prisma.$transaction([
        prisma.userCV.findMany({
            where: { userId: id },
            orderBy: { uploadedAt: 'desc' },
            take: 10
        }),
        prisma.application.findMany({
            where: { userId: id },
            include: { cv: true },
            orderBy: { generatedAt: 'desc' },
            skip,
            take
        })
    ]);

    const totalApplications = user._count.applications;
    const paginatedApplications = buildPaginationResult(applications, totalApplications, page, take);

    return ResponseHandler.success(res, {
        user: {
            ...user,
            cvs,
            applications: paginatedApplications
        }
    });
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

    try {
        await fs.access(filePath);
    } catch {
        throw new NotFoundError('CV file not found on server');
    }

    res.download(filePath, cv.fileName);
});

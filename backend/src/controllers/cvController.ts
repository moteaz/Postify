import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../utils/prisma.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ResponseHandler } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadCV = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.file) {
        throw new ValidationError('No file uploaded');
    }

    const userId = req.user.id;
    const { originalname, filename, size, mimetype } = req.file;

    const cv = await prisma.$transaction(async (tx) => {
        await tx.userCV.updateMany({
            where: { userId },
            data: { isActive: false },
        });

        return tx.userCV.create({
            data: {
                userId,
                fileName: originalname,
                fileKey: filename,
                fileSize: size,
                mimeType: mimetype,
                isActive: true,
            },
        });
    });

    return ResponseHandler.success(res, { cv }, 'CV uploaded successfully', 201);
});

export const getMyCVs = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const cvs = await prisma.userCV.findMany({
        where: { 
            userId: req.user.id,
            isArchived: false 
        },
        orderBy: { uploadedAt: 'desc' },
    });

    return ResponseHandler.success(res, { cvs });
});

export const deleteCV = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    await prisma.$transaction(async (tx) => {
        const cv = await tx.userCV.findFirst({
            where: { id, userId: req.user.id },
            include: {
                _count: {
                    select: { applications: true }
                }
            }
        });

        if (!cv) {
            throw new NotFoundError('CV not found');
        }

        if (cv.isActive) {
            throw new ValidationError('Cannot delete the active CV. Please set another CV as active first');
        }

        if (cv._count.applications > 0) {
            throw new ValidationError('Cannot delete CV that is used in applications. Archive it instead');
        }

        await tx.userCV.delete({ where: { id } });

        const localPath = path.join(__dirname, '../../uploads', cv.fileKey);
        try {
            await fs.unlink(localPath);
        } catch (err) {}
    });

    return ResponseHandler.success(res, null, 'CV deleted successfully');
});

export const setActiveCV = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user.id;

    const updated = await prisma.$transaction(async (tx) => {
        const cv = await tx.userCV.findFirst({
            where: { id, userId },
        });

        if (!cv) {
            throw new NotFoundError('CV not found');
        }

        if (cv.isArchived) {
            throw new ValidationError('Cannot set archived CV as active. Please unarchive it first');
        }

        await tx.userCV.updateMany({
            where: { userId },
            data: { isActive: false },
        });

        return tx.userCV.update({
            where: { id },
            data: { isActive: true },
        });
    });

    return ResponseHandler.success(res, { cv: updated }, 'Active CV updated');
});

export const setArchivedCV = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user.id;

    const cv = await prisma.userCV.findFirst({
        where: { id, userId },
    });

    if (!cv) {
        throw new NotFoundError('CV not found');
    }

    if (cv.isActive) {
        throw new ValidationError('Cannot remove the active CV. Please set another CV as active first');
    }

    const updated = await prisma.userCV.update({
        where: { id },
        data: { isArchived: !cv.isArchived },
    });

    return ResponseHandler.success(
        res, 
        { cv: updated }, 
        `CV ${updated.isArchived ? 'archived' : 'unarchived'} successfully`
    );
});

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../utils/prisma.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ResponseHandler } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadCV = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.file) {
        throw new ValidationError('No file uploaded');
    }

    const userId = req.user.id;
    const { originalname, filename, size, mimetype } = req.file;

    await prisma.userCV.updateMany({
        where: { userId },
        data: { isActive: false },
    });

    const cv = await prisma.userCV.create({
        data: {
            userId,
            fileName: originalname,
            fileKey: filename,
            fileSize: size,
            mimeType: mimetype,
            isActive: true,
        },
    });

    return ResponseHandler.success(res, { cv }, 'CV uploaded successfully', 201);
});

export const getMyCVs = asyncHandler(async (req: AuthRequest, res: Response) => {
    const cvs = await prisma.userCV.findMany({
        where: { userId: req.user.id },
        orderBy: { uploadedAt: 'desc' },
    });

    return ResponseHandler.success(res, { cvs });
});

export const deleteCV = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const cv = await prisma.userCV.findFirst({
        where: { id, userId: req.user.id },
    });

    if (!cv) {
        throw new NotFoundError('CV not found');
    }

    const applicationsCount = await prisma.application.count({
        where: { cvId: id }
    });

    if (applicationsCount > 0) {
        throw new ValidationError(`Cannot delete CV that is used in application(s)`);
    }

    const localPath = path.join(__dirname, '../../uploads', cv.fileKey);
    if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
    }

    await prisma.userCV.delete({ where: { id } });

    return ResponseHandler.success(res, null, 'CV deleted successfully');
});

export const setActiveCV = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;

    const cv = await prisma.userCV.findFirst({
        where: { id, userId },
    });

    if (!cv) {
        throw new NotFoundError('CV not found');
    }

    await prisma.userCV.updateMany({
        where: { userId },
        data: { isActive: false },
    });

    const updated = await prisma.userCV.update({
        where: { id },
        data: { isActive: true },
    });

    return ResponseHandler.success(res, { cv: updated }, 'Active CV updated');
});

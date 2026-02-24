import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../utils/prisma.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Upload a new CV
 */
export const uploadCV = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const userId = req.user.id;
        const { originalname, filename, path: filePath, size, mimetype } = req.file;

        // Optional: Set all other CVs for this user to inactive if this is the new active one
        // For now, let's just make the newest one active
        await prisma.userCV.updateMany({
            where: { userId },
            data: { isActive: false },
        });

        const cv = await prisma.userCV.create({
            data: {
                userId,
                fileName: originalname,
                fileKey: filename, // Local filename
                fileSize: size,
                mimeType: mimetype,
                isActive: true,
            },
        });

        res.status(201).json({
            message: 'CV uploaded successfully',
            cv,
        });
    } catch (error) {
        console.error('Upload CV Error:', error);
        res.status(500).json({ message: 'Failed to upload CV' });
    }
};

/**
 * Get all CVs for the user
 */
export const getMyCVs = async (req: AuthRequest, res: Response) => {
    try {
        const cvs = await prisma.userCV.findMany({
            where: { userId: req.user.id },
            orderBy: { uploadedAt: 'desc' },
        });

        res.json({ cvs });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch CVs' });
    }
};

/**
 * Delete a CV
 */
export const deleteCV = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const cv = await prisma.userCV.findFirst({
            where: { id, userId: req.user.id },
        });

        if (!cv) {
            return res.status(404).json({ message: 'CV not found' });
        }

        // Delete file from local storage
        const localPath = path.join(__dirname, '../../uploads', cv.fileKey);
        if (fs.existsSync(localPath)) {
            fs.unlinkSync(localPath);
        }

        await prisma.userCV.delete({ where: { id } });

        res.json({ message: 'CV deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete CV' });
    }
};

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../utils/prisma.js';
import { parseCV } from '../services/parserService.js';
import { generateApplicationContent } from '../services/aiService.js';
import { franc } from 'franc';

/**
 * Generate Application Content
 */
export const generateContent = async (req: AuthRequest, res: Response) => {
    try {
        const { jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({ message: 'Job description is required' });
        }

        const userId = req.user.id;

        // 1. Get user's active CV
        const activeCV = await prisma.userCV.findFirst({
            where: { userId, isActive: true },
        });

        if (!activeCV) {
            return res.status(400).json({ message: 'Please upload a CV first' });
        }

        // 2. Parse CV content
        const cvText = await parseCV(activeCV.fileKey, activeCV.mimeType);
        console.log('Parsed CV Text:', cvText.substring(0, 200)); // Log first 200 chars for debugging

        // 3. Detect language (simplified using franc)
        // franc returns ISO 639-3 codes (eng, fra, deu, etc.)
        const langCode = franc(jobDescription);
        let language = 'English';
        if (langCode === 'fra') language = 'French';
        if (langCode === 'deu') language = 'German';
        if (langCode === 'spa') language = 'Spanish';
        // Add more as needed or pass code directly to AI

        // 4. Generate Content via AI
        const result = await generateApplicationContent(
            jobDescription,
            cvText,
            req.user.name || 'Candidate',
            language
        );

        // 5. Save application draft to DB
        const application = await prisma.application.create({
            data: {
                userId,
                cvId: activeCV.id,
                jobDescription,
                recruiterEmail: result.recruiterEmail,
                subject: result.subject,
                coverLetter: result.coverLetter,
                status: 'DRAFT',
            },
        });

        res.json({
            message: 'Generated successfully',
            applicationId: application.id,
            content: result,
        });
    } catch (error: any) {
        console.error('Generation Error Detail:', error);
        res.status(500).json({
            message: error.message || 'Failed to generate application content',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

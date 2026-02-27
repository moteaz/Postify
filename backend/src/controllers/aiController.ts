import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../utils/prisma.js';
import { parseCV } from '../services/parserService.js';
import { generateApplicationContent } from '../services/aiService.js';
import { franc } from 'franc';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ResponseHandler } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

const detectLanguage = (text: string): string => {
    const langCode = franc(text);
    const langMap: Record<string, string> = {
        'fra': 'French',
        'deu': 'German',
        'spa': 'Spanish',
        'eng': 'English'
    };
    return langMap[langCode] || 'English';
};

export const generateContent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { jobDescription } = req.body;
    const userId = req.user.id;

    const activeCV = await prisma.userCV.findFirst({
        where: { userId, isActive: true },
    });

    if (!activeCV) {
        throw new NotFoundError('Please upload a CV first');
    }

    const cvText = await parseCV(activeCV.fileKey, activeCV.mimeType);
    logger.info('Parsed CV Text', cvText.substring(0, 200));
    

    const language = detectLanguage(jobDescription);

    const result = await generateApplicationContent(
        jobDescription,
        cvText,
        req.user.name || 'Candidate',
        language
    );

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

    return ResponseHandler.success(res, {
        applicationId: application.id,
        content: result
    }, 'Generated successfully');
});

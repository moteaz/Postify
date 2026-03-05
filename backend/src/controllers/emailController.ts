import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../utils/prisma.js';
import { sendApplicationEmail } from '../services/emailService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ResponseHandler } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { isValidEmail } from '../utils/validators.js';
import DOMPurify from 'isomorphic-dompurify';
import { logger } from '../utils/logger.js';

export const sendApplication = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { applicationId, to, subject, body } = req.body;
    const userId = req.user.id;

    const sanitizedSubject = DOMPurify.sanitize(subject, { ALLOWED_TAGS: [] });
    const sanitizedBody = DOMPurify.sanitize(body, { ALLOWED_TAGS: ['br', 'p', 'strong', 'em'] });

    const application = await prisma.application.findFirst({
        where: { id: applicationId, userId },
        include: { cv: true },
    });

    if (!application) {
        throw new NotFoundError('Application not found');
    }

    await sendApplicationEmail(
        userId,
        to,
        sanitizedSubject,
        sanitizedBody,
        application.cvId
    );

    await prisma.application.update({
        where: { id: applicationId },
        data: {
            status: 'SENT',
            sentAt: new Date(),
            recruiterEmail: to,
            subject: sanitizedSubject,
            coverLetter: sanitizedBody,
        },
    });

    return ResponseHandler.success(res, null, 'Application sent successfully!');
});

export const getHistory = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const history = await prisma.application.findMany({
        where: { userId: req.user.id },
        orderBy: { generatedAt: 'desc' },
        include: { cv: true }
    });

    return ResponseHandler.success(res, { history });
});

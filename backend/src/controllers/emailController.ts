import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ResponseHandler } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import DOMPurify from 'isomorphic-dompurify';
import { isValidEmail } from '../utils/validators.js';
import { Container } from '../di/container.js';
import { ApplicationRepository } from '../repositories/applicationRepository.js';
import { EmailService } from '../services/emailService.js';

export const sendApplication = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { applicationId, to, subject, body } = req.body;
    const userId = req.user.id;

    const sanitizedSubject = DOMPurify.sanitize(subject, { ALLOWED_TAGS: [] });
    const sanitizedBody = DOMPurify.sanitize(body, { ALLOWED_TAGS: ['br', 'p', 'strong', 'em'] });

    const appRepo = Container.resolve<ApplicationRepository>('applicationRepository');
    const emailService = Container.resolve<EmailService>('emailService');

    const application = await appRepo.findById(applicationId, userId);

    if (!application) {
        throw new NotFoundError('Application not found');
    }

    await emailService.sendApplicationEmail(
        userId,
        to,
        sanitizedSubject,
        sanitizedBody,
        application.cvId
    );

    await appRepo.updateStatus(applicationId, {
        status: 'SENT',
        sentAt: new Date(),
        recruiterEmail: to,
        subject: sanitizedSubject,
        coverLetter: sanitizedBody,
    });

    return ResponseHandler.success(res, null, 'Application sent successfully!');
});

export const getHistory = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const appRepo = Container.resolve<ApplicationRepository>('applicationRepository');
    const history = await appRepo.findByUserId(req.user.id);

    return ResponseHandler.success(res, { history });
});

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../utils/prisma.js';
import { sendApplicationEmail } from '../services/emailService.js';

/**
 * Send the application email
 */
export const sendApplication = async (req: AuthRequest, res: Response) => {
    try {
        const { applicationId, to, subject, body } = req.body;

        if (!applicationId || !to || !subject || !body) {
            return res.status(400).json({ message: 'All fields (applicationId, to, subject, body) are required' });
        }

        const userId = req.user.id;

        // 1. Verify application belongs to user
        const application = await prisma.application.findFirst({
            where: { id: applicationId, userId },
            include: { cv: true },
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // 2. Send email via service
        await sendApplicationEmail(
            userId,
            to,
            subject,
            body,
            application.cvId
        );

        // 3. Update application status
        await prisma.application.update({
            where: { id: applicationId },
            data: {
                status: 'SENT',
                sentAt: new Date(),
                recruiterEmail: to, // Update in case user edited it
                subject,
                coverLetter: body,
            },
        });

        res.json({ message: 'Application sent successfully!' });
    } catch (error: any) {
        console.error('Send Application Error:', error);

        // Log failure
        if (req.body.applicationId) {
            await prisma.application.update({
                where: { id: req.body.applicationId },
                data: {
                    status: 'FAILED',
                    errorMessage: error.message || 'Unknown error during delivery',
                },
            }).catch(console.error);
        }

        res.status(500).json({
            message: 'Failed to send email. Ensure your Gmail is connected and has permission.',
            error: error.message
        });
    }
};

/**
 * Get application history
 */
export const getHistory = async (req: AuthRequest, res: Response) => {
    try {
        const history = await prisma.application.findMany({
            where: { userId: req.user.id },
            orderBy: { generatedAt: 'desc' },
            include: { cv: true }
        });

        res.json({ history });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch application history' });
    }
};

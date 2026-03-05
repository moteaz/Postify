import nodemailer from 'nodemailer';
import { prisma } from '../utils/prisma.js';
import path from 'path';
import fs from 'fs';
import { TokenManager } from './tokenManager.js';
import { EmailConfig } from '../types/dtos.js';
import { EmailSendError } from '../utils/customErrors.js';
import { SMTP } from '../config/index.js';

const tokenManager = new TokenManager();

export const sendApplicationEmail = async (
    userId: string,
    to: string,
    subject: string,
    body: string,
    cvId: string
): Promise<any> => {
    const accessToken = await tokenManager.getValidAccessToken(userId);

    const cv = await prisma.userCV.findUnique({ where: { id: cvId } });
    if (!cv) throw new EmailSendError('CV not found');

    const cvPath = path.join(process.cwd(), 'uploads', cv.fileKey);
    if (!fs.existsSync(cvPath)) throw new EmailSendError('CV file missing on disk');

    const user = await prisma.user.findUnique({ where: { id: userId } });

    const emailConfig: EmailConfig = {
        to,
        subject,
        body,
        cvPath,
        cvFileName: cv.fileName,
        userEmail: user?.email || ''
    };

    return sendEmail(emailConfig, accessToken);
};

const sendEmail = async (config: EmailConfig, accessToken: string): Promise<any> => {
    const transporter = nodemailer.createTransport({
        host: SMTP.HOST,
        port: SMTP.PORT,
        secure: SMTP.SECURE,
        auth: {
            type: 'OAuth2',
            user: config.userEmail,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            accessToken,
        },
    } as any);

    const mailOptions = {
        from: config.userEmail,
        to: config.to,
        subject: config.subject,
        text: config.body,
        html: config.body.replace(/\n/g, '<br>'),
        attachments: [
            {
                filename: config.cvFileName,
                path: config.cvPath,
            },
        ],
    };

    return transporter.sendMail(mailOptions);
};

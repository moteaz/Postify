import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { prisma } from '../utils/prisma.js';
import path from 'path';
import fs from 'fs';
import { logger } from '../utils/logger.js';

export const sendApplicationEmail = async (
    userId: string,
    to: string,
    subject: string,
    body: string,
    cvId: string
): Promise<any> => {
    const tokens = await prisma.oAuthToken.findUnique({
        where: { 
            userId_provider: {
                userId,
                provider: 'gmail'
            }
        },
    });

    if (!tokens || !tokens.accessToken) {
        throw new Error('Gmail account not connected');
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL
    );

    oauth2Client.setCredentials({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
    });

    try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        if (credentials.access_token) {
            await prisma.oAuthToken.update({
                where: { 
                    userId_provider: {
                        userId,
                        provider: 'gmail'
                    }
                },
                data: {
                    accessToken: credentials.access_token,
                    refreshToken: credentials.refresh_token || tokens.refreshToken,
                },
            });
            oauth2Client.setCredentials(credentials);
        }
    } catch (err) {
        logger.error('Token refresh failed', err);
        throw new Error('Gmail authentication expired. Please log in again.');
    }

    const cv = await prisma.userCV.findUnique({
        where: { id: cvId },
    });

    if (!cv) {
        throw new Error('CV not found');
    }

    const cvPath = path.join(process.cwd(), 'uploads', cv.fileKey);
    if (!fs.existsSync(cvPath)) {
        throw new Error('CV file missing on disk');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: true,
        auth: {
            type: 'OAuth2',
            user: user?.email,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: tokens.refreshToken || undefined,
            accessToken: oauth2Client.credentials.access_token,
        },
    } as any);

    const mailOptions = {
        from: user?.email,
        to,
        subject,
        text: body,
        html: body.replace(/\n/g, '<br>'),
        attachments: [
            {
                filename: cv.fileName,
                path: cvPath,
            },
        ],
    };

    const result = await transporter.sendMail(mailOptions);

    return result;
};

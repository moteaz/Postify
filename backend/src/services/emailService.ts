import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { prisma } from '../utils/prisma.js';
import path from 'path';
import fs from 'fs';

/**
 * Service to send emails via Gmail API using user's OAuth tokens
 */
export const sendApplicationEmail = async (
    userId: string,
    to: string,
    subject: string,
    body: string,
    cvId: string
): Promise<any> => {
    // 1. Get user's OAuth tokens
    const tokens = await prisma.oAuthToken.findUnique({
        where: { userId },
    });

    if (!tokens || !tokens.accessToken) {
        throw new Error('Gmail account not connected');
    }

    // 2. Setup OAuth2 Client
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL
    );

    oauth2Client.setCredentials({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
    });

    // 3. Refresh token if needed
    try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        if (credentials.access_token) {
            await prisma.oAuthToken.update({
                where: { userId },
                data: {
                    accessToken: credentials.access_token,
                    refreshToken: credentials.refresh_token || tokens.refreshToken,
                },
            });
            oauth2Client.setCredentials(credentials);
        }
    } catch (err) {
        console.error('[Email] Token refresh failed:', err);
        throw new Error('Gmail authentication expired. Please log in again.');
    }

    // 4. Get CV file
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

    // 5. Get user email
    const user = await prisma.user.findUnique({ where: { id: userId } });

    // 6. Create Nodemailer transporter with OAuth2
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: user?.email,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: tokens.refreshToken || undefined,
            accessToken: oauth2Client.credentials.access_token,
        },
    } as any);

    // 7. Send Email
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

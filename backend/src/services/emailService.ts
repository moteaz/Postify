import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { TokenManager } from './tokenManager.js';
import { EmailConfig } from '../types/dtos.js';
import { EmailSendError } from '../utils/errors.js';
import { SMTP } from '../config/constants.js';
import { CVRepository } from '../repositories/cvRepository.js';
import { UserRepository } from '../repositories/userRepository.js';
import { env } from '../config/env.js';
import { fileStorage } from './fileStorageService.js';
import { logger } from '../infrastructure/logging/logger.js';

export class EmailService {
  constructor(
    private tokenManager: TokenManager,
    private cvRepo: CVRepository,
    private userRepo: UserRepository
  ) { }

  async sendApplicationEmail(
    userId: string,
    to: string,
    subject: string,
    body: string,
    cvId: string
  ): Promise<any> {
    const accessToken = await this.tokenManager.getValidAccessToken(userId);

    const cv = await this.cvRepo.findById(cvId);
    if (!cv) throw new EmailSendError('CV not found');

    const cvBuffer = await fileStorage.downloadFile(cv.fileKey);
    logger.info(`File downloaded, size: ${cvBuffer.length} bytes`);

    const user = await this.userRepo.findById(userId);

    const emailConfig: EmailConfig = {
      to,
      subject,
      body,
      cvBuffer,
      cvFileName: cv.fileName,
      userEmail: user?.email || '',
    };

    return this.sendEmail(emailConfig, accessToken);
  }

  private async sendEmail(config: EmailConfig, accessToken: string): Promise<any> {
    const oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const mailOptions = {
      from: config.userEmail,
      to: config.to,
      subject: config.subject,
      text: config.body,
      html: config.body.replace(/\n/g, '<br>'),
      attachments: [
        {
          filename: config.cvFileName,
          content: config.cvBuffer,
        },
      ],
    };

    // Use nodemailer merely to construct the raw MIME payload
    const transporter = nodemailer.createTransport({
      streamTransport: true,
      buffer: true,
    } as any);

    const info = await transporter.sendMail(mailOptions);
    const messageBuffer = (info as any).message as Buffer;

    // Convert to Base64url appropriate for the Gmail API
    const encodedMessage = messageBuffer
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
  }
}

import nodemailer from 'nodemailer';
import dns from 'node:dns';
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
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      lookup: (hostname: string, options: any, callback: any) => {
        dns.lookup(hostname, { family: 4 }, callback);
      },
      connectionTimeout: 60000,
      greetingTimeout: 60000,
      socketTimeout: 60000,
      logger: true,
      debug: true,
      auth: {
        type: 'OAuth2',
        user: config.userEmail,
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
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
          content: config.cvBuffer,
        },
      ],
    };

    return transporter.sendMail(mailOptions);
  }
}

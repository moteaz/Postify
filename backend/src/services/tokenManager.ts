import { google } from 'googleapis';
import { prisma } from '../utils/prisma.js';
import { logger } from '../utils/logger.js';
import { TokenRefreshError } from '../utils/customErrors.js';
import { PROVIDERS } from '../config/index.js';

export class TokenManager {
    private oauth2Client: any;

    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_CALLBACK_URL
        );
    }

    async getValidAccessToken(userId: string): Promise<string> {
        const tokens = await prisma.oAuthToken.findUnique({
            where: { 
                userId_provider: {
                    userId,
                    provider: PROVIDERS.GMAIL
                }
            },
        });

        if (!tokens || !tokens.accessToken) {
            throw new Error('Gmail account not connected');
        }

        this.oauth2Client.setCredentials({
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
        });

        try {
            const { credentials } = await this.oauth2Client.refreshAccessToken();
            if (credentials.access_token) {
                await prisma.oAuthToken.update({
                    where: { 
                        userId_provider: {
                            userId,
                            provider: PROVIDERS.GMAIL
                        }
                    },
                    data: {
                        accessToken: credentials.access_token,
                        refreshToken: credentials.refresh_token || tokens.refreshToken,
                    },
                });
                return credentials.access_token;
            }
            return tokens.accessToken;
        } catch (err) {
            logger.error('Token refresh failed', err);
            throw new TokenRefreshError('Gmail authentication expired. Please log in again.');
        }
    }
}

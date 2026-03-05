import { google } from 'googleapis';
import { logger } from '../infrastructure/logging/logger.js';
import { TokenRefreshError } from '../utils/customErrors.js';
import { PROVIDERS } from '../config/index.js';
import { OAuthTokenRepository } from '../repositories/oauthTokenRepository.js';
import { env } from '../config/env.js';

export class TokenManager {
    private oauth2Client: any;

    constructor(private tokenRepo: OAuthTokenRepository) {
        this.oauth2Client = new google.auth.OAuth2(
            env.GOOGLE_CLIENT_ID,
            env.GOOGLE_CLIENT_SECRET,
            env.GOOGLE_CALLBACK_URL
        );
    }

    async getValidAccessToken(userId: string): Promise<string> {
        const tokens = await this.tokenRepo.findByUserAndProvider(userId, PROVIDERS.GMAIL);

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
                await this.tokenRepo.update(userId, PROVIDERS.GMAIL, {
                    accessToken: credentials.access_token,
                    refreshToken: credentials.refresh_token || tokens.refreshToken || undefined
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

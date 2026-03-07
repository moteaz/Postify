import { PrismaClient, OAuthToken } from '@prisma/client';

export class OAuthTokenRepository {
  constructor(private db: PrismaClient) {}

  async findByUserAndProvider(userId: string, provider: string): Promise<OAuthToken | null> {
    return this.db.oAuthToken.findUnique({
      where: {
        userId_provider: { userId, provider },
      },
    });
  }

  async upsert(data: {
    userId: string;
    provider: string;
    accessToken: string;
    refreshToken?: string | null;
  }): Promise<OAuthToken> {
    return this.db.oAuthToken.upsert({
      where: {
        userId_provider: {
          userId: data.userId,
          provider: data.provider,
        },
      },
      update: {
        accessToken: data.accessToken,
        ...(data.refreshToken ? { refreshToken: data.refreshToken } : {}),
      },
      create: data,
    });
  }

  async update(
    userId: string,
    provider: string,
    data: {
      accessToken: string;
      refreshToken?: string;
    }
  ): Promise<OAuthToken> {
    return this.db.oAuthToken.update({
      where: {
        userId_provider: { userId, provider },
      },
      data,
    });
  }
}

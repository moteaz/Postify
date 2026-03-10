import { env } from '../config/env.js';
import { dbHealthCheck } from '../infrastructure/database/healthCheck.js';

export class HealthCheckService {
  async checkAIProvider(): Promise<string> {
    try {
      if (env.AI_PROVIDER === 'huggingface') {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        await fetch(
          `${process.env.HUGGINGFACE_BASE_URL || 'https://api-inference.huggingface.co'}/api/tags`,
          {
            signal: controller.signal,
          }
        );
        clearTimeout(timeoutId);
        return 'online';
      }
      return `${env.AI_PROVIDER} (assumed online)`;
    } catch {
      return 'offline';
    }
  }

  async getHealthStatus() {
    const aiStatus = await this.checkAIProvider();
    const dbConnected = await dbHealthCheck.checkConnection();

    return {
      status: dbConnected ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      service: 'Postify Backend',
      ai_provider: env.AI_PROVIDER,
      ai_status: aiStatus,
      database: dbConnected ? 'connected' : 'disconnected',
    };
  }
}

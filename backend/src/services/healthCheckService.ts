import { env } from '../config/env.js';

export class HealthCheckService {
    async checkAIProvider(): Promise<string> {
        try {
            if (env.AI_PROVIDER === 'ollama') {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000);
                await fetch(`${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}/api/tags`, { 
                    signal: controller.signal 
                });
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
        
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'Postify Backend',
            ai_provider: env.AI_PROVIDER,
            ai_status: aiStatus
        };
    }
}

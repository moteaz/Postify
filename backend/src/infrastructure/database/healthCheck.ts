import { prisma } from '../../utils/prisma.js';
import { logger } from '../logging/logger.js';

export class DatabaseHealthCheck {
  async checkConnection(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error('Database connection failed', { error });
      return false;
    }
  }

  async getConnectionPoolStats(): Promise<any> {
    try {
      const result = await prisma.$queryRaw`
                SELECT 
                    count(*) as total_connections,
                    count(*) FILTER (WHERE state = 'active') as active_connections,
                    count(*) FILTER (WHERE state = 'idle') as idle_connections
                FROM pg_stat_activity
                WHERE datname = current_database()
            `;
      return result;
    } catch (error) {
      logger.error('Failed to get connection pool stats', { error });
      return null;
    }
  }
}

export const dbHealthCheck = new DatabaseHealthCheck();

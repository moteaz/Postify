import app from './app.js';
import { env } from './config/env.js';
import { logger } from './infrastructure/logging/logger.js';
import { connectQueue, closeConnection } from './queue/cvQueue.js';

const PORT = env.PORT;

const startServer = async () => {
  try {
    await connectQueue();
    logger.info('RabbitMQ initialization complete');
    
    // Start worker in same process (for Render free tier)
    if (process.env.NODE_ENV === 'production') {
      import('./workers/cvWorker.js').catch((err) => {
        logger.error('Failed to start worker', { error: err.message });
      });
    }
  } catch (error) {
    logger.error('Failed to connect to RabbitMQ', { error: (error as Error).message });
    logger.warn('Server starting without RabbitMQ - CV parsing will be unavailable');
  }

  const server = app.listen(PORT, () => {
    logger.info(`🚀 Postify Backend Server running on port:${PORT}`);
  });

  const gracefulShutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully`);
    
    server.close(async () => {
      logger.info('HTTP server closed');
      
      await closeConnection();
      
      logger.info('Shutdown complete');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

startServer();

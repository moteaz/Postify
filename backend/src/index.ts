import app from './app.js';
import { env } from './config/env.js';
import { logger } from './infrastructure/logging/logger.js';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
    logger.info(`🚀 Postify Backend running on http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

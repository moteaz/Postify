import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import './config/passport.js';
import authRoutes from './routes/auth.js';
import cvRoutes from './routes/cvRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/email', emailRoutes);

app.get('/health', async (req, res) => {
    let aiStatus = 'unknown';
    try {
        if (process.env.AI_PROVIDER === 'ollama') {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            await fetch(`${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}/api/tags`, { signal: controller.signal });
            clearTimeout(timeoutId);
            aiStatus = 'online';
        } else if (process.env.AI_PROVIDER === 'openrouter') {
            aiStatus = 'openrouter (assumed online)';
        } else {
            aiStatus = 'openai (assumed online)';
        }
    } catch (e) {
        aiStatus = 'offline';
    }

    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Postify Backend',
        ai_provider: process.env.AI_PROVIDER || 'openai',
        ai_status: aiStatus
    });
});

/**
 * Global Error Handler
 */
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('SERVER_ERROR:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

export default app;

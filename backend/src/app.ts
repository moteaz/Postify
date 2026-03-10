import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import './config/passport.js';
import authRoutes from './routes/auth.js';
import cvRoutes from './routes/cvRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { env } from './config/env.js';
import { initializeContainer } from './di/bindings.js';

initializeContainer();

const app = express();

app.set('trust proxy', 1);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [env.CLIENT_URL, 'http://localhost:3000', 'http://localhost:5173'];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use('/api/', generalLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

export default app;

import { Router } from 'express';
import passport from 'passport';
import { signToken } from '../utils/jwt.js';
import { protect } from '../middleware/auth.js';
import { JWT } from '../config/constants.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { env } from '../config/env.js';

const router = Router();

router.get(
  '/google',
  authLimiter,
  passport.authenticate('google', {
    scope: ['profile', 'email', 'https://mail.google.com/'],
    accessType: 'offline',
    prompt: 'consent',
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=oauth_failed' }),
  (req, res) => {
    const user = req.user as any;
    if (!user) {
      return res.redirect(`${env.CLIENT_URL}/login?error=no_user`);
    }

    const token = signToken(user.id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: JWT.COOKIE_MAX_AGE,
      path: '/',
    });

    res.redirect(`${env.CLIENT_URL}/auth/callback`);
  }
);

router.get('/me', protect, (req: any, res) => {
  res.json({ success: true, data: { user: req.user } });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;

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
    scope: ['openid','profile', 'email', 'https://www.googleapis.com/auth/gmail.send'],
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
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: JWT.COOKIE_MAX_AGE,
      path: '/',
    });

    // Fix: Appending the token to the URL so the cross-origin frontend can capture it.
    // This bypasses Safari's strict 3rd-party cookie blocking.
    res.redirect(`${env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

router.get('/me', protect, (req: any, res) => {
  res.json({ success: true, data: { user: req.user } });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;

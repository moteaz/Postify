import { Router } from 'express';
import passport from 'passport';
import { signToken } from '../utils/jwt.js';

const router = Router();

// Initiate Google Login
router.get(
    '/google',
    passport.authenticate('google', {
        scope: [
            'profile',
            'email',
            'https://www.googleapis.com/auth/gmail.send',
        ],
        accessType: 'offline',
        prompt: 'consent',
    })
);

// Google OAuth Callback
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login?error=oauth_failed' }),
    (req, res) => {
        const user = req.user as any;
        if (!user) {
            return res.redirect(`${process.env.CLIENT_URL}/login?error=no_user`);
        }

        // Issue JWT
        const token = signToken(user.id);

        // Redirect back to frontend with token in URL (simple for MVP)
        // In production, consider secure cookie or safe callback
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    }
);

// Get current user profile
router.get('/me', (req, res) => {
    // This will be protected by middleware later
    res.json({ user: req.user });
});

export default router;

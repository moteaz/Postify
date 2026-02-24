import { Router } from 'express';
import passport from 'passport';
import { signToken } from '../utils/jwt.js';
import { protect } from '../middleware/auth.js';

const router = Router();

/**
 * Initiate Google Login
 */
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

/**
 * Google OAuth Callback
 */
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

        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Redirect to callback page with token
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    }
);

/**
 * Get current user profile
 */
router.get('/me', protect, (req: any, res) => {
    res.json({ user: req.user });
});

/**
 * Logout
 */
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

export default router;

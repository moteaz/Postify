import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../utils/prisma.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || 'placeholder',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder',
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0].value;
                if (!email) {
                    return done(new Error('No email found in Google profile'), undefined);
                }

                // Find or create user
                let user = await prisma.user.findUnique({
                    where: { providerAccountId: profile.id },
                });

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            email,
                            name: profile.displayName,
                            avatarUrl: profile.photos?.[0].value,
                            provider: 'GOOGLE',
                            providerAccountId: profile.id,
                        },
                    });
                }

                // Store or update OAuth tokens for Gmail access
                // Note: In a real app, you'd request Gmail scopes here too
                await prisma.oAuthToken.upsert({
                    where: { userId: user.id },
                    update: {
                        accessToken,
                        refreshToken,
                        // Google OAuth doesn't always return refreshToken unless prompt='consent' is used
                        ...(refreshToken ? { refreshToken } : {}),
                    },
                    create: {
                        userId: user.id,
                        accessToken,
                        refreshToken,
                    },
                });

                return done(null, user);
            } catch (error) {
                return done(error as Error, undefined);
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

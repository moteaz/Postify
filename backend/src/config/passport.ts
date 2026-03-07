import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env.js';
import { Container } from '../di/container.js';
import { UserRepository } from '../repositories/userRepository.js';
import { OAuthTokenRepository } from '../repositories/oauthTokenRepository.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(new Error('No email found in Google profile'), undefined);
        }

        // Check if email is in admin whitelist
        const adminEmails = env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
        const isAdmin = adminEmails.includes(email);

        // Find or create user
        const userRepo = Container.resolve<UserRepository>('userRepository');
        const tokenRepo = Container.resolve<OAuthTokenRepository>('oauthTokenRepository');

        let user = await userRepo.findByProvider('GOOGLE', profile.id);

        if (!user) {
          user = await userRepo.create({
            email,
            name: profile.displayName,
            avatarUrl: profile.photos?.[0].value,
            provider: 'GOOGLE',
            providerAccountId: profile.id,
            role: isAdmin ? 'ADMIN' : 'USER',
          });
        }

        await tokenRepo.upsert({
          userId: user.id,
          provider: 'gmail',
          accessToken,
          refreshToken,
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
    const userRepo = Container.resolve<UserRepository>('userRepository');
    const user = await userRepo.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

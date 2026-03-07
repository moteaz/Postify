import { Container } from './container.js';
import { prisma } from '../utils/prisma.js';
import { UserRepository } from '../repositories/userRepository.js';
import { CVRepository } from '../repositories/cvRepository.js';
import { ApplicationRepository } from '../repositories/applicationRepository.js';
import { OAuthTokenRepository } from '../repositories/oauthTokenRepository.js';
import { TokenManager } from '../services/tokenManager.js';
import { EmailService } from '../services/emailService.js';

export const initializeContainer = () => {
  Container.register('prisma', () => prisma);

  Container.register('userRepository', () => new UserRepository(Container.resolve('prisma')));
  Container.register('cvRepository', () => new CVRepository(Container.resolve('prisma')));
  Container.register(
    'applicationRepository',
    () => new ApplicationRepository(Container.resolve('prisma'))
  );
  Container.register(
    'oauthTokenRepository',
    () => new OAuthTokenRepository(Container.resolve('prisma'))
  );

  Container.register(
    'tokenManager',
    () => new TokenManager(Container.resolve('oauthTokenRepository'))
  );
  Container.register(
    'emailService',
    () =>
      new EmailService(
        Container.resolve('tokenManager'),
        Container.resolve('cvRepository'),
        Container.resolve('userRepository')
      )
  );
};

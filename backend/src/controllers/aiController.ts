import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { generateApplicationContent } from '../services/aiService.js';
import { franc } from 'franc';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ResponseHandler } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';
import { Container } from '../di/container.js';
import { CVRepository } from '../repositories/cvRepository.js';
import { ApplicationRepository } from '../repositories/applicationRepository.js';

const detectLanguage = (text: string): string => {
  const langCode = franc(text);
  const langMap: Record<string, string> = {
    fra: 'French',
    deu: 'German',
    spa: 'Spanish',
    eng: 'English',
  };
  return langMap[langCode] || 'English';
};

export const generateContent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { jobDescription } = req.body;
  const userId = req.user.id;

  const cvRepo = Container.resolve<CVRepository>('cvRepository');
  const appRepo = Container.resolve<ApplicationRepository>('applicationRepository');

  const activeCV = await cvRepo.findActiveByUserId(userId);

  if (!activeCV) {
    throw new NotFoundError('Please upload a CV first');
  }

  if (!activeCV.parsedText) {
    throw new NotFoundError('CV content not available. Please re-upload your CV');
  }

  const language = detectLanguage(jobDescription);

  const result = await generateApplicationContent(
    jobDescription,
    activeCV.parsedText,
    req.user.name || 'Candidate',
    language
  );

  const application = await appRepo.create({
    userId,
    cvId: activeCV.id,
    jobDescription,
    recruiterEmail: result.recruiterEmail,
    subject: result.subject,
    coverLetter: result.coverLetter,
  });

  ResponseHandler.success(
    res,
    {
      applicationId: application.id,
      content: result,
    },
    'Generated successfully'
  );
});

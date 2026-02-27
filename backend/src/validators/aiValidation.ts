import { z } from 'zod';
import { APPLICATION } from '../config/constants.js';

export const generateApplicationSchema = z.object({
    body: z.object({
        jobDescription: z.string()
            .min(APPLICATION.MIN_JOB_DESC_LENGTH, `Job description is too short (minimum ${APPLICATION.MIN_JOB_DESC_LENGTH} characters)`)
            .max(APPLICATION.MAX_JOB_DESC_LENGTH, `Job description is too long (maximum ${APPLICATION.MAX_JOB_DESC_LENGTH} characters)`)
    })
});

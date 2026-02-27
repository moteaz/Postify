import { z } from 'zod';
import { APPLICATION } from '../config/constants.js';

export const sendApplicationSchema = z.object({
    body: z.object({
        applicationId: z.string().uuid('Invalid application ID'),
        to: z.string().email('Invalid email address'),
        subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
        body: z.string().min(1, 'Body is required').max(APPLICATION.MAX_COVER_LETTER_LENGTH, 'Body too long')
    })
});

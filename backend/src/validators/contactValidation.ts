import { z } from 'zod';

export const createContactSchema = z.object({
  body: z.object({
    type: z.string().min(1, 'Contact type is required').max(20, 'Type too long'),
    value: z.string().min(1, 'Contact value is required').max(255, 'Value too long'),
  }),
});

export const updateContactSchema = z.object({
  body: z.object({
    value: z.string().min(1, 'Contact value is required').max(255, 'Value too long'),
  }),
  params: z.object({
    id: z.string().uuid('Invalid contact ID'),
  }),
});

export const deleteContactSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid contact ID'),
  }),
});

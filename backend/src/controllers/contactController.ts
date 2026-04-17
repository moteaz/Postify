import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../utils/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ResponseHandler } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export const getAllContacts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const contacts = await prisma.userContacts.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });

  ResponseHandler.success(res, { contacts });
});

export const createContact = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { type, value } = req.body;

  const existing = await prisma.userContacts.findUnique({
    where: {
      userId_type: {
        userId: req.user.id,
        type,
      },
    },
  });

  if (existing) {
    throw new ValidationError(`Contact type '${type}' already exists`);
  }

  const contact = await prisma.userContacts.create({
    data: {
      userId: req.user.id,
      type,
      value,
    },
  });

  ResponseHandler.success(res, { contact }, 'Contact created successfully', 201);
});

export const updateContact = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const { value } = req.body;

  const contact = await prisma.userContacts.findFirst({
    where: { id, userId: req.user.id },
  });

  if (!contact) {
    throw new NotFoundError('Contact not found');
  }

  const updated = await prisma.userContacts.update({
    where: { id },
    data: { value },
  });

  ResponseHandler.success(res, { contact: updated }, 'Contact updated successfully');
});

export const deleteContact = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };

  const contact = await prisma.userContacts.findFirst({
    where: { id, userId: req.user.id },
  });

  if (!contact) {
    throw new NotFoundError('Contact not found');
  }

  await prisma.userContacts.delete({
    where: { id },
  });

  ResponseHandler.success(res, null, 'Contact deleted successfully');
});

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../utils/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ResponseHandler } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { fileStorage } from '../services/fileStorageService.js';
import { publishCVJob } from '../queue/cvQueue.js';
import { FILE_UPLOAD } from '../config/constants.js';
import { logger } from '../infrastructure/logging/logger.js';
import { Prisma, CVStatus } from '@prisma/client';
import { sanitizeFilename } from '../utils/fileUtils.js';

export const uploadCV = asyncHandler(async (req: AuthRequest, res: Response) => {
  // 1. Validate file exists
  if (!req.file) {
    throw new ValidationError('Please select a CV file to upload');
  }

  const userId = req.user.id;
  const { originalname, buffer, size, mimetype } = req.file;

  // 2. Validate file size
  if (size > FILE_UPLOAD.MAX_SIZE) {
    throw new ValidationError(
      `File too large. Maximum size is ${FILE_UPLOAD.MAX_SIZE / 1024 / 1024}MB`
    );
  }

  // 3. Validate MIME type
  if (!FILE_UPLOAD.ALLOWED_TYPES.includes(mimetype as any)) {
    throw new ValidationError('Invalid file type. Only PDF and DOCX are allowed');
  }

  // 4. Sanitize filename
  const sanitizedFilename = sanitizeFilename(originalname);

  logger.info('CV upload initiated', {
    userId,
    fileName: sanitizedFilename,
    fileSize: size,
    mimeType: mimetype,
  });

  // 5. Upload to Cloudinary first (reduces queue message size)
  let uploadResult;
  try {
    uploadResult = await fileStorage.uploadFile(buffer, sanitizedFilename);
  } catch (error) {
    logger.error('Cloudinary upload failed', {
      userId,
      fileName: sanitizedFilename,
      error: (error as Error).message,
    });
    throw new ValidationError('Failed to upload file. Please try again');
  }

  // 6. Create DB record in transaction
  const cv = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Deactivate all existing CVs
    await tx.userCV.updateMany({
      where: { userId },
      data: { isActive: false },
    });

    // Create new CV record
    return tx.userCV.create({
      data: {
        userId,
        fileName: sanitizedFilename,
        fileKey: uploadResult.fileKey,
        fileSize: size,
        mimeType: mimetype,
        status: CVStatus.PENDING,
        parsedText: null,
        isActive: true,
      },
    });
  });

  // 7. Publish job to queue (with error handling)
  try {
    await publishCVJob({
      cvId: cv.id,
      fileKey: cv.fileKey,
      mimeType: mimetype,
      userId,
    });

    logger.info('CV upload queued', {
      cvId: cv.id,
      userId,
      fileKey: cv.fileKey,
    });
  } catch (error) {
    logger.error('Failed to queue CV job', {
      cvId: cv.id,
      userId,
      error: (error as Error).message,
    });

    await prisma.userCV.update({
      where: { id: cv.id },
      data: { status: CVStatus.FAILED },
    });

    throw new ValidationError('Failed to queue CV processing. Please try again');
  }

  // 8. Return 202 Accepted
  ResponseHandler.success(
    res,
    { cv },
    'CV upload queued for processing',
    202
  );
});

export const getMyCVs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cvs = await prisma.userCV.findMany({
    where: {
      userId: req.user.id,
      isArchived: false,
    },
    orderBy: { uploadedAt: 'desc' },
  });

  ResponseHandler.success(res, { cvs });
});

export const deleteCV = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const cv = await tx.userCV.findFirst({
      where: { id, userId: req.user.id },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!cv) {
      throw new NotFoundError('CV not found');
    }

    if (cv.isActive) {
      throw new ValidationError(
        'Cannot delete the active CV. Please set another CV as active first'
      );
    }

    if (cv._count.applications > 0) {
      throw new ValidationError(
        'Cannot delete CV that is used in applications. Archive it instead'
      );
    }

    await tx.userCV.delete({ where: { id } });
    
    // Delete from Cloudinary (outside transaction - fire and forget)
    fileStorage.deleteFile(cv.fileKey).catch((err) => {
      logger.error('Failed to delete file from Cloudinary', {
        fileKey: cv.fileKey,
        error: err.message,
      });
    });
  });

  logger.info('CV deleted', { cvId: id, userId: req.user.id });
  ResponseHandler.success(res, null, 'CV deleted successfully');
});

export const setActiveCV = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const userId = req.user.id;

  const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const cv = await tx.userCV.findFirst({
      where: { id, userId },
    });

    if (!cv) {
      throw new NotFoundError('CV not found');
    }

    if (cv.isArchived) {
      throw new ValidationError('Cannot set archived CV as active. Please unarchive it first');
    }

    if (cv.status !== CVStatus.DONE) {
      throw new ValidationError('Cannot set CV as active. CV is still processing or failed');
    }

    await tx.userCV.updateMany({
      where: { userId },
      data: { isActive: false },
    });

    return tx.userCV.update({
      where: { id },
      data: { isActive: true },
    });
  });

  logger.info('Active CV updated', { cvId: id, userId });
  ResponseHandler.success(res, { cv: updated }, 'Active CV updated');
});

export const setArchivedCV = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const userId = req.user.id;

  const cv = await prisma.userCV.findFirst({
    where: { id, userId },
  });

  if (!cv) {
    throw new NotFoundError('CV not found');
  }

  if (cv.isActive) {
    throw new ValidationError('Cannot archive the active CV. Please set another CV as active first');
  }

  const updated = await prisma.userCV.update({
    where: { id },
    data: { isArchived: !cv.isArchived },
  });

  logger.info('CV archive status updated', {
    cvId: id,
    userId,
    isArchived: updated.isArchived,
  });

  ResponseHandler.success(
    res,
    { cv: updated },
    `CV ${updated.isArchived ? 'archived' : 'unarchived'} successfully`
  );
});

import { UploadApiResponse } from 'cloudinary';
import { cloudinary } from '../config/cloudinary.js';
import PQueue from 'p-queue';
import { logger } from '../infrastructure/logging/logger.js';

export interface FileUploadResult {
  fileKey: string;
  url: string;
}

// Limit concurrent Cloudinary uploads to 3 (Render free tier optimal)
const uploadQueue = new PQueue({ concurrency: 3 });

export class FileStorageService {

  async uploadFile(buffer: Buffer, fileName: string): Promise<FileUploadResult> {
    return uploadQueue.add(async () => {
      const maxRetries = 3;
      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                resource_type: 'raw',
                folder: 'postify/cvs',
                public_id: fileName.replace(/\.[^/.]+$/, ''),
                use_filename: true,
                format: 'pdf',
                type: 'authenticated',
              },
              (error, result) => {
                if (error || !result) return reject(error);
                resolve(result);
              }
            );

            uploadStream.end(buffer);
          });

          return {
            fileKey: uploadResult.public_id,
            url: uploadResult.secure_url,
          };
        } catch (error: any) {
          lastError = error;
          const isRateLimit = error?.http_code === 420 || error?.http_code === 429;

          if (isRateLimit && attempt < maxRetries) {
            const delay = Math.pow(2, attempt) * 500; // Exponential backoff: 1s, 2s, 4s
            logger.warn(`Cloudinary rate limit hit, retrying in ${delay}ms`, { attempt });
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          throw error;
        }
      }

      throw lastError || new Error('Upload failed after retries');
    });
  }

  async deleteFile(fileKey: string): Promise<void> {
    await cloudinary.uploader.destroy(fileKey, { resource_type: 'raw' }).catch(() => {});
  }

  async fileExists(fileKey: string): Promise<boolean> {
    try {
      await cloudinary.api.resource(fileKey, { resource_type: 'raw' });
      return true;
    } catch {
      return false;
    }
  }

  getFileUrl(fileKey: string): string {
    const cleanKey = fileKey.replace('postify/cvs/cvs/', 'postify/cvs/');
    return cloudinary.url(cleanKey, {
      resource_type: 'raw',
      secure: true,
      format: 'pdf',
    });
  }

  getOptimizedUrl(fileKey: string): string {
    return cloudinary.url(fileKey, {
      resource_type: 'raw',
      secure: true,
      format: 'pdf',
    });
  }

  async downloadFile(fileKey: string): Promise<Buffer> {
    const cleanKey = fileKey.replace('postify/cvs/cvs/', 'postify/cvs/');

    try {
      logger.info('Downloading file from Cloudinary', { fileKey: cleanKey });
      
      const url = cloudinary.utils.private_download_url(cleanKey, 'pdf', {
        resource_type: 'raw',
        type: 'authenticated',
        expires_at: Math.floor(Date.now() / 1000) + 60,
      });

      logger.debug('Generated download URL', { url: url.substring(0, 50) + '...' });

      const response = await fetch(url);
      
      logger.debug('Fetch response', { status: response.status, ok: response.ok });
      
      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Cloudinary download failed', { 
          status: response.status, 
          statusText: response.statusText,
          error: errorText 
        });
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const buffer = Buffer.from(await response.arrayBuffer());
      logger.info('File downloaded successfully', { size: buffer.length });
      return buffer;
    } catch (error) {
      logger.error('Failed to download file', { 
        fileKey: cleanKey,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw new Error(`Failed to download file: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export const fileStorage = new FileStorageService();
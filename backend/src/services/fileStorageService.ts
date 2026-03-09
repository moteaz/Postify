import { UploadApiResponse } from 'cloudinary';
import { cloudinary } from '../config/cloudinary.js';

export interface FileUploadResult {
  fileKey: string;
  url: string;
}

export class FileStorageService {

  async uploadFile(buffer: Buffer, fileName: string): Promise<FileUploadResult> {
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
      const url = cloudinary.utils.private_download_url(cleanKey, 'pdf', {
        resource_type: 'raw',
        type: 'authenticated',
        expires_at: Math.floor(Date.now() / 1000) + 60,
      });

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      throw new Error(`Failed to download file: ${(error as Error).message}`);
    }
  }
}

export const fileStorage = new FileStorageService();
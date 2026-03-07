import fs from 'fs/promises';
import { cloudinary } from '../config/cloudinary.js';

export interface FileUploadResult {
  fileKey: string;
  url: string;
}

export class FileStorageService {
  async uploadFile(filePath: string, fileName: string): Promise<FileUploadResult> {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: 'image',
      folder: 'postify/cvs',
      public_id: fileName.replace(/\.[^/.]+$/, ''),
      use_filename: true,
      format: 'pdf',
      type: 'authenticated',
    });

    await fs.unlink(filePath).catch(() => {});

    return {
      fileKey: uploadResult.public_id,
      url: uploadResult.secure_url,
    };
  }

  async deleteFile(fileKey: string): Promise<void> {
    await cloudinary.uploader.destroy(fileKey, { resource_type: 'image' }).catch(() => {});
  }

  async fileExists(fileKey: string): Promise<boolean> {
    try {
      await cloudinary.api.resource(fileKey, { resource_type: 'image' });
      return true;
    } catch {
      return false;
    }
  }

  getFileUrl(fileKey: string): string {
    const cleanKey = fileKey.replace('postify/cvs/cvs/', 'postify/cvs/');
    return cloudinary.url(cleanKey, {
      resource_type: 'image',
      secure: true,
      format: 'pdf',
    });
  }

  getOptimizedUrl(fileKey: string): string {
    return cloudinary.url(fileKey, {
      resource_type: 'image',
      secure: true,
      format: 'pdf',
    });
  }

  async downloadFile(fileKey: string): Promise<Buffer> {
    const cleanKey = fileKey.replace('postify/cvs/cvs/', 'postify/cvs/');

    try {
      const url = cloudinary.utils.private_download_url(cleanKey, 'pdf', {
        resource_type: 'image',
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

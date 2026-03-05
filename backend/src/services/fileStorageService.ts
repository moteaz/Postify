import fs from 'fs/promises';
import path from 'path';
import { env } from '../config/env.js';

// Cloudinary configuration (ready but not active)
// Uncomment when ready to migrate
/*
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
});
*/

export interface FileUploadResult {
    fileKey: string;
    url?: string;
}

export class FileStorageService {
    private useCloudinary = false; // Set to true when migrating

    async uploadFile(filePath: string, fileName: string): Promise<FileUploadResult> {
        if (this.useCloudinary) {
            // Cloudinary upload (ready to use)
            /*
            const result = await cloudinary.uploader.upload(filePath, {
                folder: 'cvs',
                resource_type: 'raw',
                public_id: fileName,
                use_filename: true
            });
            
            return {
                fileKey: result.public_id,
                url: result.secure_url
            };
            */
        }

        // Local storage (current implementation)
        return {
            fileKey: fileName
        };
    }

    async deleteFile(fileKey: string): Promise<void> {
        if (this.useCloudinary) {
            // Cloudinary delete (ready to use)
            /*
            await cloudinary.uploader.destroy(fileKey, { 
                resource_type: 'raw' 
            });
            */
            return;
        }

        // Local storage delete
        const filePath = path.join(process.cwd(), 'uploads', fileKey);
        try {
            await fs.unlink(filePath);
        } catch (err) {
            // File doesn't exist, ignore
        }
    }

    async fileExists(fileKey: string): Promise<boolean> {
        if (this.useCloudinary) {
            // Cloudinary check (ready to use)
            /*
            try {
                await cloudinary.api.resource(fileKey, { resource_type: 'raw' });
                return true;
            } catch {
                return false;
            }
            */
        }

        // Local storage check
        const filePath = path.join(process.cwd(), 'uploads', fileKey);
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    getFileUrl(fileKey: string): string {
        if (this.useCloudinary) {
            // Cloudinary URL (ready to use)
            /*
            return cloudinary.url(fileKey, { 
                resource_type: 'raw',
                secure: true 
            });
            */
        }

        // Local storage URL
        return `/uploads/${fileKey}`;
    }
}

export const fileStorage = new FileStorageService();

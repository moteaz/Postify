import fs from 'fs/promises';
import path from 'path';

export interface FileUploadResult {
    fileKey: string;
    url?: string;
}

export class FileStorageService {
    async uploadFile(filePath: string, fileName: string): Promise<FileUploadResult> {
        return { fileKey: fileName };
    }

    async deleteFile(fileKey: string): Promise<void> {
        const filePath = path.join(process.cwd(), 'uploads', fileKey);
        try {
            await fs.unlink(filePath);
        } catch (err) {}
    }

    async fileExists(fileKey: string): Promise<boolean> {
        const filePath = path.join(process.cwd(), 'uploads', fileKey);
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    getFileUrl(fileKey: string): string {
        return `/uploads/${fileKey}`;
    }
}

export const fileStorage = new FileStorageService();

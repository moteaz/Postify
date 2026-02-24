import fs from 'fs';
import mammoth from 'mammoth';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Parses a CV file into plain text
 * @param fileKey The filename in the uploads directory
 * @param mimeType The file MIME type
 */
export const parseCV = async (fileKey: string, mimeType: string): Promise<string> => {
    // Correct pathing for ESM monorepo structure
    const filePath = path.join(process.cwd(), 'uploads', fileKey);

    if (!fs.existsSync(filePath)) {
        throw new Error(`CV file not found on disk: ${filePath}`);
    }

    const dataBuffer = fs.readFileSync(filePath);

    if (mimeType === 'application/pdf') {
        const data = await pdf(dataBuffer);
        return data.text;
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const data = await mammoth.extractRawText({ buffer: dataBuffer });
        return data.value;
    } else {
        throw new Error('Unsupported file type for parsing');
    }
};

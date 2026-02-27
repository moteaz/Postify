import fs from 'fs';
import mammoth from 'mammoth';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { logger } from '../utils/logger.js';

const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const parseCV = async (fileKey: string, mimeType: string): Promise<string> => {
    const rootDir = path.join(__dirname, '../../');
    const filePath = path.join(rootDir, 'uploads', fileKey);

    logger.info('Processing file', filePath);

    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found at: ${filePath}`);
    }

    const dataBuffer = fs.readFileSync(filePath);

    if (mimeType === 'application/pdf') {
        try {
            const parser = new PDFParse({
                data: dataBuffer,
                verbosity: 0
            });

            const result = await parser.getText();

            if (!result || !result.text) {
                throw new Error('PDF parsing completed but returned no text content.');
            }

            return result.text;
        } catch (err: any) {
            logger.error('PDF Error', err.message);
            throw new Error(`PDF Parsing failed: ${err.message}`);
        }
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        try {
            const data = await mammoth.extractRawText({ buffer: dataBuffer });
            return data.value;
        } catch (err: any) {
            throw new Error(`Word Parsing failed: ${err.message}`);
        }
    } else {
        throw new Error('Unsupported format. Please upload PDF or DOCX.');
    }
};

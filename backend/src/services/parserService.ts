import fs from 'fs';
import mammoth from 'mammoth';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
// In v2.4.5, the main export is an object containing the PDFParse class
const { PDFParse } = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Parses a CV file into plain text
 * @param fileKey The filename in the uploads directory
 * @param mimeType The file MIME type
 */
export const parseCV = async (fileKey: string, mimeType: string): Promise<string> => {
    const rootDir = path.join(__dirname, '../../');
    const filePath = path.join(rootDir, 'uploads', fileKey);

    console.log(`[Parser] Processing file: ${filePath}`);

    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found at: ${filePath}`);
    }

    const dataBuffer = fs.readFileSync(filePath);

    if (mimeType === 'application/pdf') {
        try {
            // Instantiate the PDFParse class with the data buffer
            const parser = new PDFParse({
                data: dataBuffer,
                verbosity: 0 // Suppress logs
            });

            // Get text content
            const result = await parser.getText();

            if (!result || !result.text) {
                throw new Error('PDF parsing completed but returned no text content.');
            }

            return result.text;
        } catch (err: any) {
            console.error('[Parser] PDF Error:', err);
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

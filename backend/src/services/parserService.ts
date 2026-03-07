import mammoth from 'mammoth';
import { createRequire } from 'module';
import { logger } from '../infrastructure/logging/logger.js';
import { fileStorage } from './fileStorageService.js';

const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

export const parseCV = async (fileKey: string, mimeType: string): Promise<string> => {
  logger.info('Processing file from Cloudinary', { fileKey });

  const dataBuffer = await fileStorage.downloadFile(fileKey);

  if (mimeType === 'application/pdf') {
    try {
      const parser = new PDFParse({
        data: dataBuffer,
        verbosity: 0,
      });

      const result = await parser.getText();

      if (!result || !result.text) {
        throw new Error('PDF parsing completed but returned no text content.');
      }

      return result.text;
    } catch (err) {
      logger.error('PDF Error', { message: (err as Error).message });
      throw new Error(`PDF Parsing failed: ${(err as Error).message}`);
    }
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    try {
      const data = await mammoth.extractRawText({ buffer: dataBuffer });
      return data.value;
    } catch (err) {
      throw new Error(`Word Parsing failed: ${(err as Error).message}`);
    }
  } else {
    throw new Error('Unsupported format. Please upload PDF or DOCX.');
  }
};

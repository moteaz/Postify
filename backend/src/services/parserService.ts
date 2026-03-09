import mammoth from 'mammoth';
import { createRequire } from 'module';
import { logger } from '../infrastructure/logging/logger.js';
import { fileStorage } from './fileStorageService.js';

const require = createRequire(import.meta.url);
const { pdfParse } = require('pdf-parse');

export const parseCV = async (input: Buffer | string, mimeType: string): Promise<string> => {
  logger.info('Parsing CV', { type: typeof input === 'string' ? 'fileKey' : 'buffer' });

  const dataBuffer = typeof input === 'string' ? await fileStorage.downloadFile(input) : input;

  if (mimeType === 'application/pdf') {
    try {
      const parser = new pdfParse({ data: dataBuffer, verbosity: 0 });
      const result = await parser.getText();

      if (!result?.text) {
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

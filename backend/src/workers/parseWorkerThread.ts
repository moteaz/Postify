import { parentPort, workerData } from 'worker_threads';
import mammoth from 'mammoth';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

interface WorkerData {
  buffer: Buffer;
  mimeType: string;
}

const parseCV = async (buffer: Buffer, mimeType: string): Promise<string> => {
  console.log('[Worker Thread] Starting parse', { mimeType, bufferSize: buffer.length });
  
  if (mimeType === 'application/pdf') {
    try {
      console.log('[Worker Thread] Parsing PDF');
      const parser = new PDFParse({ data: buffer, verbosity: 0 });
      const result = await parser.getText();

      if (!result?.text) {
        throw new Error('PDF parsing completed but returned no text content.');
      }

      console.log('[Worker Thread] PDF parsed successfully', { textLength: result.text.length });
      return result.text;
    } catch (err) {
      console.error('[Worker Thread] PDF parsing error', err);
      throw new Error(`PDF Parsing failed: ${(err as Error).message}`);
    }
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    try {
      console.log('[Worker Thread] Parsing DOCX');
      const data = await mammoth.extractRawText({ buffer });
      console.log('[Worker Thread] DOCX parsed successfully', { textLength: data.value.length });
      return data.value;
    } catch (err) {
      console.error('[Worker Thread] DOCX parsing error', err);
      throw new Error(`Word Parsing failed: ${(err as Error).message}`);
    }
  } else {
    throw new Error('Unsupported format. Please upload PDF or DOCX.');
  }
};

(async () => {
  try {
    console.log('[Worker Thread] Started');
    const { buffer, mimeType } = workerData as WorkerData;
    
    const parsedText = await parseCV(buffer, mimeType);
    
    console.log('[Worker Thread] Sending success message');
    parentPort?.postMessage({ success: true, parsedText });
  } catch (error) {
    console.error('[Worker Thread] Error caught', error);
    parentPort?.postMessage({ 
      success: false, 
      error: (error as Error).message 
    });
  }
})();

import path from 'path';

/**
 * Sanitizes a filename by removing path traversal attempts and special characters
 * @param filename - The original filename
 * @returns Sanitized filename safe for file systems
 * @example
 * sanitizeFilename('../../../etc/passwd.pdf') // returns 'passwd.pdf'
 * sanitizeFilename('<script>alert("xss")</script>.pdf') // returns 'scriptalertxssscript.pdf'
 */
export const sanitizeFilename = (filename: string): string => {
  // Remove path traversal attempts
  const basename = path.basename(filename);
  
  // Remove special characters except dots, dashes, underscores
  // Limit to 255 characters (filesystem limit)
  return basename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 255);
};

/**
 * Validates if a file extension is allowed
 * @param filename - The filename to check
 * @param allowedExtensions - Array of allowed extensions (e.g., ['.pdf', '.docx'])
 * @returns true if extension is allowed
 */
export const hasValidExtension = (filename: string, allowedExtensions: string[]): boolean => {
  const ext = path.extname(filename).toLowerCase();
  return allowedExtensions.includes(ext);
};

/**
 * Generates a unique filename by appending timestamp
 * @param filename - Original filename
 * @returns Unique filename with timestamp
 * @example
 * generateUniqueFilename('resume.pdf') // returns 'resume-1705512345678.pdf'
 */
export const generateUniqueFilename = (filename: string): string => {
  const ext = path.extname(filename);
  const basename = path.basename(filename, ext);
  const sanitized = sanitizeFilename(basename);
  return `${sanitized}-${Date.now()}${ext}`;
};

/**
 * Formats file size to human-readable string
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Extracts file extension from filename
 * @param filename - The filename
 * @returns Extension without dot (e.g., 'pdf')
 */
export const getFileExtension = (filename: string): string => {
  return path.extname(filename).slice(1).toLowerCase();
};

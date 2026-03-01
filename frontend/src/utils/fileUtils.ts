/**
 * Truncates a filename while preserving the extension
 * @param filename - The full filename
 * @param maxLength - Maximum length before truncation (default: 40)
 * @returns Truncated filename with extension
 * 
 * @example
 * truncateFilename("Python_Essentials_1_certificate_mh23660968.pdf", 30)
 * // Returns: "Python_Essentials_1_cer...pdf"
 */
export function truncateFilename(filename: string, maxLength: number = 40): string {
  if (filename.length <= maxLength) return filename;

  const lastDotIndex = filename.lastIndexOf('.');
  const extension = lastDotIndex !== -1 ? filename.slice(lastDotIndex) : '';
  const nameWithoutExt = lastDotIndex !== -1 ? filename.slice(0, lastDotIndex) : filename;

  const availableLength = maxLength - extension.length - 3; // 3 for "..."
  
  if (availableLength <= 0) {
    return filename.slice(0, maxLength - 3) + '...';
  }

  return nameWithoutExt.slice(0, availableLength) + '...' + extension;
}

/**
 * Formats file size in human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

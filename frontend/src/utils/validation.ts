export const validators = {
  email: (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  notEmpty: (str: string): boolean => str.trim().length > 0,
  fileSize: (size: number, maxMB: number = 5): boolean => size <= maxMB * 1024 * 1024,
  fileType: (fileName: string, allowedTypes: string[]): boolean => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ext ? allowedTypes.includes(ext) : false;
  }
};

const sanitizeLog = (input: string): string => {
    return input.replace(/[\n\r]/g, ' ').substring(0, 500);
};

export const logger = {
    error: (message: string, data?: any) => {
        const sanitizedMsg = sanitizeLog(message);
        const sanitizedData = data ? sanitizeLog(typeof data === 'string' ? data : JSON.stringify(data)) : '';
        console.error(`[ERROR] ${sanitizedMsg}`, sanitizedData);
    },
    info: (message: string, data?: any) => {
        const sanitizedMsg = sanitizeLog(message);
        const sanitizedData = data ? sanitizeLog(typeof data === 'string' ? data : JSON.stringify(data)) : '';
        console.log(`[INFO] ${sanitizedMsg}`, sanitizedData);
    },
    warn: (message: string, data?: any) => {
        const sanitizedMsg = sanitizeLog(message);
        const sanitizedData = data ? sanitizeLog(typeof data === 'string' ? data : JSON.stringify(data)) : '';
        console.warn(`[WARN] ${sanitizedMsg}`, sanitizedData);
    }
};

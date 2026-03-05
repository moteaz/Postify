export const logger = {
  error: (message: string, error?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(message, error);
    } else {
      console.error(message);
      // TODO: Send to monitoring service (Sentry, DataDog, etc.)
    }
  },
  
  warn: (message: string, context?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(message, context);
    }
  },
  
  info: (message: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(message);
    }
  },
  
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(message, data);
    }
  }
};

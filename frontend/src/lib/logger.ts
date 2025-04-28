const isDev = process.env.NODE_ENV === 'development';

/**
 * Utility para logs que solo aparecen en ambiente de desarrollo
 */
export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (isDev) {
      console.error(...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },
  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args);
    }
  }
}; 
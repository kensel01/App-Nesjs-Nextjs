const isDev = process.env.NODE_ENV === 'development';
// Creamos una variable de entorno de niveles de log 
// Esta variable podría establecerse como 'verbose' en el archivo .env para debug
const LOG_LEVEL = process.env.NEXT_PUBLIC_LOG_LEVEL || 'minimal';

/**
 * Utility para logs que solo aparecen en ambiente de desarrollo
 * Con control de nivel de detalle a través de LOG_LEVEL
 */
export const logger = {
  log: (...args: any[]) => {
    if (isDev && LOG_LEVEL === 'verbose') {
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
    if (isDev && LOG_LEVEL === 'verbose') {
      console.info(...args);
    }
  }
}; 
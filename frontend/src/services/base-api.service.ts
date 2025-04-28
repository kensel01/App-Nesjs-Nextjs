import { getSession } from 'next-auth/react';
import { logger } from '@/lib/logger';

interface CustomSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  accessToken?: string;
  expires: string;
}

export class BaseApiService {
  protected API_URL: string;
  protected MAX_RETRIES = 3;
  protected RETRY_DELAY = 1000;

  constructor(apiUrl?: string) {
    this.API_URL = apiUrl || process.env.NEXT_PUBLIC_API_URL || '';
  }

  // Helper para esperar un tiempo determinado
  protected wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Obtener headers con autorización
  protected async getHeaders(): Promise<HeadersInit> {
    const session = await getSession();
    logger.log('Session in getHeaders:', session ? 'Session exists' : 'No session');
    
    // Obtener el token de accessToken dentro del objeto user
    const token = session?.user?.accessToken;
    
    if (!token) {
      logger.warn('No token available in session');
    } else {
      logger.log('Token available for request');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // Construir parámetros de filtro para queries
  protected buildFilterParams(filters: Record<string, any>): string {
    if (!filters || Object.keys(filters).length === 0) return '';
    
    return Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `&${key}=${encodeURIComponent(value)}`)
      .join('');
  }

  // Fetch con reintentos y backoff exponencial
  protected async fetchWithRetry(
    url: string, 
    options: RequestInit, 
    retries = this.MAX_RETRIES, 
    delay = this.RETRY_DELAY
  ): Promise<Response> {
    try {
      logger.log(`Making request to: ${url}`);
      
      // Log de las cabeceras para debugging
      if (options.headers) {
        const hasAuth = (options.headers as any)['Authorization'] ? 'Yes' : 'No';
        logger.log(`Request headers - Auth present: ${hasAuth}`);
      }
      
      const response = await fetch(url, options);
      
      // Log de la respuesta para debugging
      logger.log(`Response status: ${response.status}`);
      
      // Si hay un error de autorización, podemos intentar refrescar el token en futuras versiones
      if (response.status === 401) {
        logger.error('Authorization error (401). Token may be invalid or expired.');
      }
      
      // Si hay rate limiting (429), esperar y reintentar
      if (response.status === 429 && retries > 0) {
        const retryAfter = response.headers.get('retry-after');
        const delayMs = retryAfter ? parseInt(retryAfter) * 1000 : delay;
        
        logger.log(`Rate limited. Retrying after ${delayMs}ms. Retries left: ${retries-1}`);
        await this.wait(delayMs);
        return this.fetchWithRetry(url, options, retries - 1, delay * 1.5); // Backoff exponencial
      }
      
      return response;
    } catch (error) {
      if (retries > 0) {
        logger.log(`Network error. Retrying after ${delay}ms. Retries left: ${retries-1}`);
        await this.wait(delay);
        return this.fetchWithRetry(url, options, retries - 1, delay * 1.5); // Backoff exponencial
      }
      throw error;
    }
  }
} 
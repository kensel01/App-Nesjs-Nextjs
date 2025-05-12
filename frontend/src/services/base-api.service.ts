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
  protected readonly MAX_RETRIES = 3;
  protected readonly RETRY_DELAY = 1000; // milliseconds

  constructor(apiUrl?: string) {
    this.API_URL = apiUrl || process.env.NEXT_PUBLIC_API_URL || '';
  }

  // Helper para esperar un tiempo determinado
  protected wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Obtener headers con autorización
  protected async getHeaders(): Promise<HeadersInit> {
    const session = await getSession();
    // Reducimos logging de sesión en cada petición
    // logger.log('Session in getHeaders:', session ? 'Session exists' : 'No session');
    
    // Obtener el token de accessToken dentro del objeto user
    const token = session?.user?.accessToken;
    
    if (!token) {
      logger.warn('No token available in session');
    }
    // Eliminamos log redundante
    // else {
    //   logger.log('Token available for request');
    // }
    
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
      // Reducimos logging de URL en cada petición
      // logger.log(`Making request to: ${url}`);
      
      // Eliminamos logging de cabeceras en cada petición
      // if (options.headers) {
      //   const hasAuth = (options.headers as any)['Authorization'] ? 'Yes' : 'No';
      //   logger.log(`Request headers - Auth present: ${hasAuth}`);
      // }
      
      const response = await fetch(url, options);
      
      // Eliminamos logging de estado en cada petición
      // logger.log(`Response status: ${response.status}`);
      
      if (response.status === 401) {
        logger.error('Authorization error (401). Token may be invalid or expired.');
      }
      
      // Si hay rate limiting (429), no reintentar automáticamente
      if (response.status === 429) {
        logger.error('Rate limited (429). Aborting retries.');
        throw new Error('Too Many Requests');
      }
      
      return response;
    } catch (error: any) {
      // Si es rate limit, no reintentar
      if (error instanceof Error && error.message === 'Too Many Requests') {
        throw error;
      }
      if (retries > 0) {
        logger.log(`Network error. Retrying after ${delay}ms. Retries left: ${retries-1}`);
        await this.wait(delay);
        return this.fetchWithRetry(url, options, retries - 1, delay * 1.5); // Backoff exponencial
      }
      throw error;
    }
  }
} 
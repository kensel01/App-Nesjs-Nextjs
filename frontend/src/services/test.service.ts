import { getSession } from 'next-auth/react';
import { logger } from '@/lib/logger';

class TestService {
  private apiUrl: string;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // milliseconds

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  // Helper function to wait for specified milliseconds
  private wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Fetch with retry logic
  private async fetchWithRetry(url: string, options: RequestInit, retries = this.MAX_RETRIES, delay = this.RETRY_DELAY): Promise<Response> {
    try {
      const response = await fetch(url, options);
      
      // If we get rate limited (429), wait and retry
      if (response.status === 429 && retries > 0) {
        // Get retry-after header or use default delay
        const retryAfter = response.headers.get('retry-after');
        const delayMs = retryAfter ? parseInt(retryAfter) * 1000 : delay;
        
        logger.log(`Rate limited. Retrying after ${delayMs}ms. Retries left: ${retries-1}`);
        await this.wait(delayMs);
        return this.fetchWithRetry(url, options, retries - 1, delay * 1.5); // Exponential backoff
      }
      
      return response;
    } catch (error) {
      if (retries > 0) {
        logger.log(`Network error. Retrying after ${delay}ms. Retries left: ${retries-1}`);
        await this.wait(delay);
        return this.fetchWithRetry(url, options, retries - 1, delay * 1.5); // Exponential backoff
      }
      throw error;
    }
  }

  private async getHeaders() {
    const session = await getSession();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    };
  }

  async checkConnection(): Promise<any> {
    try {
      logger.log('Checking server connection...');
      logger.log('URL:', this.apiUrl);

      const startTime = Date.now();
      const response = await this.fetchWithRetry(`${this.apiUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const endTime = Date.now();

      logger.log('Server responded in', endTime - startTime, 'ms');
      logger.log('Status:', response.status);
      logger.log('Status Text:', response.statusText);

      if (!response.ok) {
        throw new Error(`Server connection failed: ${response.statusText}`);
      }

      const data = await response.json();
      logger.log('Response:', data);

      return {
        success: true,
        message: 'Conexión exitosa',
        data,
        responseTime: endTime - startTime
      };
    } catch (error) {
      logger.error('Server connection error:', error);
      throw error;
    }
  }

  async checkServerConnection(): Promise<boolean> {
    try {
      logger.log('Checking server connection...');
      logger.log('URL:', this.apiUrl);

      const startTime = Date.now();
      const response = await this.fetchWithRetry(`${this.apiUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const endTime = Date.now();

      logger.log('Server responded in', endTime - startTime, 'ms');
      logger.log('Status:', response.status);
      logger.log('Status Text:', response.statusText);

      if (!response.ok) {
        logger.error('Server connection failed:', response.statusText);
        return false;
      }

      const data = await response.json();
      logger.log('Response:', data);

      return true;
    } catch (error) {
      logger.error('Server connection error:', error);
      return false;
    }
  }

  async testAuthEndpoint(): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    try {
      logger.log('Testing auth endpoint...');
      logger.log('URL:', `${this.apiUrl}/api/v1/auth/profile`);

      const headers = await this.getHeaders();
      logger.log('Headers:', headers);

      const startTime = Date.now();
      const response = await this.fetchWithRetry(
        `${this.apiUrl}/api/v1/auth/profile`,
        {
          method: 'GET',
          headers,
        }
      );
      const endTime = Date.now();

      logger.log('Auth endpoint responded in', endTime - startTime, 'ms');
      logger.log('Status:', response.status);
      logger.log('Status Text:', response.statusText);

      if (!response.ok) {
        logger.error('Auth endpoint test failed:', response.statusText);
        return {
          success: false,
          message: `Error en la respuesta: ${response.statusText}`,
        };
      }

      const data = await response.json();
      logger.log('Response:', data);

      return {
        success: true,
        message: 'Autenticación exitosa',
        data,
      };
    } catch (error) {
      logger.error('Auth endpoint test error:', error);
      return {
        success: false,
        message: `Error en la comunicación con el servidor: ${error}`,
      };
    }
  }
}

export const testService = new TestService(); 
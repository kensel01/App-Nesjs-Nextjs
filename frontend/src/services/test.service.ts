import { getSession } from 'next-auth/react';

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
        
        console.log(`Rate limited. Retrying after ${delayMs}ms. Retries left: ${retries-1}`);
        await this.wait(delayMs);
        return this.fetchWithRetry(url, options, retries - 1, delay * 1.5); // Exponential backoff
      }
      
      return response;
    } catch (error) {
      if (retries > 0) {
        console.log(`Network error. Retrying after ${delay}ms. Retries left: ${retries-1}`);
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

  async checkServerConnection(): Promise<boolean> {
    try {
      console.log('Checking server connection...');
      console.log('URL:', this.apiUrl);

      const startTime = Date.now();
      const response = await this.fetchWithRetry(`${this.apiUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const endTime = Date.now();

      console.log('Server responded in', endTime - startTime, 'ms');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);

      if (!response.ok) {
        console.error('Server connection failed:', response.statusText);
        return false;
      }

      const data = await response.json();
      console.log('Response:', data);

      return true;
    } catch (error) {
      console.error('Server connection error:', error);
      return false;
    }
  }

  async testAuthEndpoint(): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    try {
      console.log('Testing auth endpoint...');
      console.log('URL:', `${this.apiUrl}/api/v1/auth/profile`);

      const headers = await this.getHeaders();
      console.log('Headers:', headers);

      const startTime = Date.now();
      const response = await this.fetchWithRetry(
        `${this.apiUrl}/api/v1/auth/profile`,
        {
          method: 'GET',
          headers,
        }
      );
      const endTime = Date.now();

      console.log('Auth endpoint responded in', endTime - startTime, 'ms');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);

      if (!response.ok) {
        console.error('Auth endpoint test failed:', response.statusText);
        return {
          success: false,
          message: `Error en la respuesta: ${response.statusText}`,
        };
      }

      const data = await response.json();
      console.log('Response:', data);

      return {
        success: true,
        message: 'Autenticación exitosa',
        data,
      };
    } catch (error) {
      console.error('Auth endpoint test error:', error);
      return {
        success: false,
        message: `Error en la comunicación con el servidor: ${error}`,
      };
    }
  }
}

export const testService = new TestService(); 
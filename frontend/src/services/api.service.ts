import { getSession } from 'next-auth/react';

/**
 * Centralized API service with retry logic for handling rate limiting
 */
export class ApiService {
  private readonly baseUrl: string;
  private readonly maxRetries: number;
  private readonly initialRetryDelay: number;

  constructor(baseUrl?: string, maxRetries = 3, initialRetryDelay = 1000) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || '';
    this.maxRetries = maxRetries;
    this.initialRetryDelay = initialRetryDelay;
  }

  /**
   * Helper method to wait for a specified number of milliseconds
   */
  private wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

  /**
   * Get authenticated headers with the JWT token
   */
  private async getAuthHeaders(): Promise<HeadersInit> {
    const session = await getSession();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: session?.user?.accessToken ? `Bearer ${session.user.accessToken}` : '',
    };
  }

  /**
   * Fetch wrapper with retry logic for rate limit handling
   * Automatically retries requests that fail with 429 status
   */
  async fetchWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    retries = this.maxRetries,
    delay = this.initialRetryDelay
  ): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, options);
      
      // If we get rate limited (429), wait and retry
      if (response.status === 429 && retries > 0) {
        // Get retry-after header or use default delay
        const retryAfter = response.headers.get('retry-after');
        const delayMs = retryAfter ? parseInt(retryAfter) * 1000 : delay;
        
        console.log(`Rate limited. Retrying after ${delayMs}ms. Retries left: ${retries-1}`);
        await this.wait(delayMs);
        return this.fetchWithRetry<T>(endpoint, options, retries - 1, delay * 1.5); // Exponential backoff
      }
      
      // For successful responses, parse and return the JSON
      if (response.ok) {
        // Handle empty responses (for DELETE operations)
        if (response.status === 204) {
          return {} as T;
        }
        
        return await response.json() as T;
      }
      
      // Handle HTTP errors
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      
    } catch (error) {
      // Retry network errors
      if (retries > 0 && !(error instanceof Error && error.message.includes('Error '))) {
        console.log(`Network error. Retrying after ${delay}ms. Retries left: ${retries-1}`);
        await this.wait(delay);
        return this.fetchWithRetry<T>(endpoint, options, retries - 1, delay * 1.5);
      }
      
      // If we've run out of retries or it's an HTTP error, throw it
      throw error;
    }
  }

  /**
   * GET request with retry logic
   */
  async get<T>(endpoint: string, authenticated = true): Promise<T> {
    const headers = authenticated ? await this.getAuthHeaders() : { 'Content-Type': 'application/json' };
    
    return this.fetchWithRetry<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  /**
   * POST request with retry logic
   */
  async post<T>(endpoint: string, data: any, authenticated = true): Promise<T> {
    const headers = authenticated ? await this.getAuthHeaders() : { 'Content-Type': 'application/json' };
    
    return this.fetchWithRetry<T>(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request with retry logic
   */
  async put<T>(endpoint: string, data: any, authenticated = true): Promise<T> {
    const headers = authenticated ? await this.getAuthHeaders() : { 'Content-Type': 'application/json' };
    
    return this.fetchWithRetry<T>(endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request with retry logic
   */
  async patch<T>(endpoint: string, data: any, authenticated = true): Promise<T> {
    const headers = authenticated ? await this.getAuthHeaders() : { 'Content-Type': 'application/json' };
    
    return this.fetchWithRetry<T>(endpoint, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request with retry logic
   */
  async delete<T>(endpoint: string, authenticated = true): Promise<T> {
    const headers = authenticated ? await this.getAuthHeaders() : { 'Content-Type': 'application/json' };
    
    return this.fetchWithRetry<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }
}

// Export a singleton instance for use throughout the app
export const apiService = new ApiService(); 
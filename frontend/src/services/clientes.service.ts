import { Cliente, CreateClienteDto, UpdateClienteDto } from '@/types/cliente.types';
import { getSession } from 'next-auth/react';

interface GetClientesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: keyof Cliente;
  sortOrder?: 'ASC' | 'DESC';
}

interface GetClientesResponse {
  clientes: Cliente[];
  total: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // milliseconds

const getHeaders = async () => {
  const session = await getSession();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.user?.accessToken}`,
  };
};

// Helper function to wait for specified milliseconds
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch with retry logic
const fetchWithRetry = async (url: string, options: RequestInit, retries = MAX_RETRIES, delay = RETRY_DELAY) => {
  try {
    const response = await fetch(url, options);
    
    // If we get rate limited (429), wait and retry
    if (response.status === 429 && retries > 0) {
      // Get retry-after header or use default delay
      const retryAfter = response.headers.get('retry-after');
      const delayMs = retryAfter ? parseInt(retryAfter) * 1000 : delay;
      
      console.log(`Rate limited. Retrying after ${delayMs}ms. Retries left: ${retries-1}`);
      await wait(delayMs);
      return fetchWithRetry(url, options, retries - 1, delay * 1.5); // Exponential backoff
    }
    
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Network error. Retrying after ${delay}ms. Retries left: ${retries-1}`);
      await wait(delay);
      return fetchWithRetry(url, options, retries - 1, delay * 1.5); // Exponential backoff
    }
    throw error;
  }
};

export const clientesService = {
  getClientes: async ({
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'name',
    sortOrder = 'ASC',
  }: GetClientesParams = {}): Promise<GetClientesResponse> => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder }),
      });

      const url = `${API_URL}/api/v1/clientes?${queryParams}`;
      console.log('URL de la petición:', url);

      const response = await fetchWithRetry(url, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Error al obtener los clientes');
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (!data) {
        return {
          clientes: [],
          total: 0,
        };
      }

      if (Array.isArray(data)) {
        return {
          clientes: data,
          total: data.length,
        };
      }

      if (data.data && Array.isArray(data.data)) {
        return {
          clientes: data.data,
          total: data.total || data.data.length,
        };
      }

      if (data.clientes && Array.isArray(data.clientes)) {
        return {
          clientes: data.clientes,
          total: data.total || data.clientes.length,
        };
      }

      throw new Error('Formato de respuesta inválido');
    } catch (error) {
      console.error('Error en getClientes:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Cliente> => {
    console.log('URL de la petición:', `${API_URL}/api/v1/clientes/${id}`);
    const response = await fetchWithRetry(`${API_URL}/api/v1/clientes/${id}`, {
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Error al obtener el cliente');
    }

    return response.json();
  },

  create: async (data: CreateClienteDto): Promise<Cliente> => {
    console.log('URL de la petición:', `${API_URL}/api/v1/clientes`);
    const response = await fetchWithRetry(`${API_URL}/api/v1/clientes`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Error al crear el cliente');
    }

    return response.json();
  },

  update: async (id: number, data: UpdateClienteDto): Promise<Cliente> => {
    console.log('URL de la petición:', `${API_URL}/api/v1/clientes/${id}`);
    const response = await fetchWithRetry(`${API_URL}/api/v1/clientes/${id}`, {
      method: 'PATCH',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Error al actualizar el cliente');
    }

    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    console.log('URL de la petición:', `${API_URL}/api/v1/clientes/${id}`);
    const response = await fetchWithRetry(`${API_URL}/api/v1/clientes/${id}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Error al eliminar el cliente');
    }
  },
}; 
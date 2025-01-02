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

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const getHeaders = async () => {
  const session = await getSession();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.user?.token}`,
  };
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

      const response = await fetch(
        `${API_URL}/api/v1/clientes?${queryParams}`,
        {
          headers: await getHeaders(),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Error al obtener los clientes');
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data); // Para debug

      // Si la respuesta es null o undefined
      if (!data) {
        return {
          clientes: [],
          total: 0,
        };
      }

      // Si la respuesta es un array directamente
      if (Array.isArray(data)) {
        return {
          clientes: data,
          total: data.length,
        };
      }

      // Si la respuesta es un objeto con la propiedad data que contiene los clientes
      if (data.data && Array.isArray(data.data)) {
        return {
          clientes: data.data,
          total: data.total || data.data.length,
        };
      }

      // Si la respuesta es un objeto con la propiedad clientes
      if (data.clientes && Array.isArray(data.clientes)) {
        return {
          clientes: data.clientes,
          total: data.total || data.clientes.length,
        };
      }

      // Si no podemos manejar el formato de la respuesta
      throw new Error('Formato de respuesta inválido');
    } catch (error) {
      console.error('Error en getClientes:', error); // Para debug
      throw error;
    }
  },

  getById: async (id: number): Promise<Cliente> => {
    const response = await fetch(`${API_URL}/api/v1/clientes/${id}`, {
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Error al obtener el cliente');
    }

    return response.json();
  },

  create: async (data: CreateClienteDto): Promise<Cliente> => {
    const response = await fetch(`${API_URL}/api/v1/clientes`, {
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
    const response = await fetch(`${API_URL}/api/v1/clientes/${id}`, {
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
    const response = await fetch(`${API_URL}/api/v1/clientes/${id}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Error al eliminar el cliente');
    }
  },
}; 
import { TipoDeServicio } from '@/types/cliente.types';
import { getSession } from 'next-auth/react';

interface GetTiposDeServicioParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: keyof TipoDeServicio;
  sortOrder?: 'ASC' | 'DESC';
}

interface GetTiposDeServicioResponse {
  tiposDeServicio: TipoDeServicio[];
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

export const tiposDeServicioService = {
  getTiposDeServicio: async ({
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'name',
    sortOrder = 'ASC',
  }: GetTiposDeServicioParams = {}): Promise<GetTiposDeServicioResponse> => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
    });

    const response = await fetch(
      `${API_URL}/api/v1/tipos-de-servicio?${queryParams}`,
      {
        headers: await getHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Error al obtener los tipos de servicio');
    }

    const data = await response.json();
    
    // Asegurarse de que la respuesta tenga el formato correcto
    if (!data) {
      throw new Error('Formato de respuesta inválido');
    }

    // Si la respuesta es un array, asumimos que son los tipos de servicio directamente
    if (Array.isArray(data)) {
      return {
        tiposDeServicio: data,
        total: data.length,
      };
    }

    // Si la respuesta es un objeto con la propiedad tiposDeServicio
    if (Array.isArray(data.tiposDeServicio)) {
      return {
        tiposDeServicio: data.tiposDeServicio,
        total: data.total || data.tiposDeServicio.length,
      };
    }

    throw new Error('Formato de respuesta inválido');
  },

  getTipoDeServicioById: async (id: number): Promise<TipoDeServicio> => {
    const response = await fetch(`${API_URL}/api/v1/tipos-de-servicio/${id}`, {
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Error al obtener el tipo de servicio');
    }

    return response.json();
  },

  create: async (data: Omit<TipoDeServicio, 'id'>): Promise<TipoDeServicio> => {
    const response = await fetch(`${API_URL}/api/v1/tipos-de-servicio`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Error al crear el tipo de servicio');
    }

    return response.json();
  },

  update: async (
    id: number,
    data: Partial<TipoDeServicio>
  ): Promise<TipoDeServicio> => {
    const response = await fetch(`${API_URL}/api/v1/tipos-de-servicio/${id}`, {
      method: 'PATCH',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Error al actualizar el tipo de servicio');
    }

    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/api/v1/tipos-de-servicio/${id}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Error al eliminar el tipo de servicio');
    }
  },
}; 
import { TipoDeServicio, CreateTipoDeServicioDto, UpdateTipoDeServicioDto } from '@/types/cliente.types';
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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = async () => {
  const session = await getSession();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.user?.accessToken}`,
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
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder }),
      });

      const url = `${API_URL}/api/v1/tipos-de-servicio?${queryParams}`;

      const response = await fetch(url, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Error al obtener los tipos de servicio');
      }

      const data = await response.json();

      if (!data) {
        return {
          tiposDeServicio: [],
          total: 0,
        };
      }

      if (Array.isArray(data)) {
        return {
          tiposDeServicio: data,
          total: data.length,
        };
      }

      if (data.data && Array.isArray(data.data)) {
        return {
          tiposDeServicio: data.data,
          total: data.total || data.data.length,
        };
      }

      if (data.tiposDeServicio && Array.isArray(data.tiposDeServicio)) {
        return {
          tiposDeServicio: data.tiposDeServicio,
          total: data.total || data.tiposDeServicio.length,
        };
      }

      throw new Error('Formato de respuesta inválido');
    } catch (error) {
      console.error('Error en getTiposDeServicio:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<TipoDeServicio> => {
    const response = await fetch(`${API_URL}/api/v1/tipos-de-servicio/${id}`, {
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Error al obtener el tipo de servicio');
    }

    return response.json();
  },

  create: async (data: CreateTipoDeServicioDto): Promise<TipoDeServicio> => {
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

  update: async (id: number, data: UpdateTipoDeServicioDto): Promise<TipoDeServicio> => {
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
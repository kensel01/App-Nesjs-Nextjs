'use client';

import { User, CreateUserDTO, UpdateUserDTO } from '@/types/user.types';
import { getSession } from 'next-auth/react';
import { logger } from '@/lib/logger';

interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: keyof User;
  sortOrder?: 'ASC' | 'DESC';
}

interface GetUsersResponse {
  users: User[];
  total: number;
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  user: User;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = async () => {
  const session = await getSession();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.user?.accessToken}`,
  };
};

export const usersService = {
  getUsers: async ({
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'name',
    sortOrder = 'ASC',
  }: GetUsersParams = {}): Promise<GetUsersResponse> => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder }),
      });

      const url = `${API_URL}/api/v1/users?${queryParams}`;
      logger.log('URL de la petición:', url);

      const response = await fetch(url, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Error al obtener los usuarios');
      }

      const data = await response.json();
      logger.log('Respuesta del servidor:', data);

      if (!data) {
        return {
          users: [],
          total: 0,
        };
      }

      if (Array.isArray(data)) {
        return {
          users: data,
          total: data.length,
        };
      }

      if (data.data && Array.isArray(data.data)) {
        return {
          users: data.data,
          total: data.total || data.data.length,
        };
      }

      if (data.users && Array.isArray(data.users)) {
        return {
          users: data.users,
          total: data.total || data.users.length,
        };
      }

      throw new Error('Formato de respuesta inválido');
    } catch (error) {
      logger.error('Error en getUsers:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<User> => {
    const response = await fetch(`${API_URL}/api/v1/users/${id}`, {
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Error al obtener el usuario');
    }

    return response.json();
  },

  create: async (data: CreateUserDTO): Promise<User> => {
    logger.log('URL de la petición:', `${API_URL}/api/v1/users`);
    
    const userData = {
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role
    };
    
    logger.log('Datos enviados al servidor:', userData);

    const headers = await getHeaders();
    logger.log('Headers:', headers);

    try {
      const response = await fetch(`${API_URL}/api/v1/users`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(userData),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        logger.error('Error response:', responseData);
        if (Array.isArray(responseData.message)) {
          throw new Error(responseData.message.join(', '));
        }
        throw new Error(responseData.message || 'Error al crear el usuario');
      }

      return responseData;
    } catch (error) {
      logger.error('Error completo:', error);
      throw error;
    }
  },

  update: async (id: number, data: UpdateUserDTO): Promise<User> => {
    const response = await fetch(`${API_URL}/api/v1/users/${id}`, {
      method: 'PATCH',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Error al actualizar el usuario');
    }

    return response.json();
  },

  updateProfile: async (data: UpdateUserDTO): Promise<UpdateProfileResponse> => {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/profile/me`, {
        method: 'PATCH',
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Error al actualizar el perfil');
      }

      return response.json();
    } catch (error) {
      logger.error('Error en updateProfile:', error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/api/v1/users/${id}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Error al eliminar el usuario');
    }
  },

  toggleUserStatus: async (id: number): Promise<{ success: boolean; message: string; user: User }> => {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/${id}/toggle-status`, {
        method: 'PATCH',
        headers: await getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Error al cambiar el estado del usuario');
      }

      return response.json();
    } catch (error) {
      logger.error('Error al cambiar el estado del usuario:', error);
      throw error;
    }
  },
}; 
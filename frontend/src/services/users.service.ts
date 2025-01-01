import { ENDPOINTS } from '@/config/api';
import { User } from '@/types/user.types';
import { getSession } from 'next-auth/react';

interface GetUsersParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: keyof User;
  sortOrder?: 'ASC' | 'DESC';
}

interface GetUsersResponse {
  users: User[];
  total: number;
}

class UsersService {
  private async getAuthHeaders() {
    const session = await getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.token}`,
    };
  }

  async getUsers(params: GetUsersParams): Promise<GetUsersResponse> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      ...(params.search && { search: params.search }),
      ...(params.sortBy && { sortBy: params.sortBy }),
      ...(params.sortOrder && { sortOrder: params.sortOrder }),
    });

    const response = await fetch(`${ENDPOINTS.USERS.BASE}?${queryParams}`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener usuarios');
    }

    return response.json();
  }

  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${ENDPOINTS.USERS.BASE}/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar usuario');
    }
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const response = await fetch(`${ENDPOINTS.USERS.BASE}/${id}`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar usuario');
    }

    return response.json();
  }

  async getUser(id: number): Promise<User> {
    const response = await fetch(`${ENDPOINTS.USERS.BASE}/${id}`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener usuario');
    }

    return response.json();
  }
}

export const usersService = new UsersService(); 
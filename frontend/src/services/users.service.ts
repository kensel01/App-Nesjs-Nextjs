import { BaseApiService } from './base-api.service';
import { User, CreateUserDTO, UpdateUserDTO } from '@/types/user.types';

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

export class UsuariosService extends BaseApiService {
  async getUsers(params: GetUsersParams = {}): Promise<GetUsersResponse> {
    const { page = 1, limit = 10, search = '', sortBy, sortOrder } = params;
    const filters: Record<string, any> = {};
    if (search) filters.search = search;
    if (sortBy) {
      filters.sortBy = sortBy;
      filters.sortOrder = sortOrder;
    }
    const url = `${this.API_URL}/api/v1/users?page=${page}&limit=${limit}${this.buildFilterParams(filters)}`;
    const response = await this.fetchWithRetry(url, { headers: await this.getHeaders() });
    if (!response.ok) {
      throw new Error(`Error en getUsers: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    let users: User[] = [];
    let total: number = 0;
    if (Array.isArray(data)) {
      users = data;
      total = data.length;
    } else if (data.data && Array.isArray(data.data)) {
      users = data.data;
      total = data.total ?? data.data.length;
    } else if (data.users && Array.isArray(data.users)) {
      users = data.users;
      total = data.total ?? data.users.length;
    } else {
      throw new Error('Formato de respuesta inválido en getUsers');
    }
    return { users, total };
  }

  async getById(id: number): Promise<User> {
    const response = await this.fetchWithRetry(
      `${this.API_URL}/api/v1/users/${id}`,
      { headers: await this.getHeaders() }
    );
    if (!response.ok) {
      throw new Error(`Error en getById: ${response.status}`);
    }
    return await response.json();
  }

  async create(data: CreateUserDTO): Promise<User> {
    const response = await this.fetchWithRetry(
      `${this.API_URL}/api/v1/users`,
      {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error(`Error en create: ${response.status}`);
    }
    return await response.json();
  }

  async update(id: number, data: UpdateUserDTO): Promise<User> {
    const response = await this.fetchWithRetry(
      `${this.API_URL}/api/v1/users/${id}`,
      {
        method: 'PATCH',
        headers: await this.getHeaders(),
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error(`Error en update: ${response.status}`);
    }
    return await response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await this.fetchWithRetry(
      `${this.API_URL}/api/v1/users/${id}`,
      { method: 'DELETE', headers: await this.getHeaders() }
    );
    if (!response.ok) {
      throw new Error(`Error en delete: ${response.status}`);
    }
  }

  async toggleUserStatus(id: number): Promise<{ success: boolean; message: string; user: User }> {
    const response = await this.fetchWithRetry(
      `${this.API_URL}/api/v1/users/${id}/toggle-status`,
      { method: 'PATCH', headers: await this.getHeaders() }
    );
    if (!response.ok) {
      throw new Error(`Error en toggleUserStatus: ${response.status}`);
    }
    return await response.json();
  }

  async updateProfile(data: UpdateUserDTO): Promise<UpdateProfileResponse> {
    const response = await this.fetchWithRetry(
      `${this.API_URL}/api/v1/users/profile/me`,
      {
        method: 'PATCH',
        headers: await this.getHeaders(),
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error(`Error en updateProfile: ${response.status}`);
    }
    return await response.json();
  }
}

export const usuariosService = new UsuariosService();
export const usersService = usuariosService; 
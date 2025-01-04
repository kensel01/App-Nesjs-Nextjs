'use client';

import { CreateUserDTO, UpdateUserDTO, User } from '@/types/user.types';
import { getHeaders } from '@/lib/auth';

class UsersService {
  private baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users`;

  async getAll(params: Record<string, any> = {}): Promise<{ users: User[]; total: number }> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const response = await fetch(`${this.baseUrl}?${queryParams.toString()}`, {
      headers: await getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener usuarios');
    }

    return response.json();
  }

  async getById(id: number): Promise<User> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      headers: await getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener usuario');
    }

    return response.json();
  }

  async create(data: CreateUserDTO): Promise<User> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear usuario');
    }

    return response.json();
  }

  async update(id: number, data: UpdateUserDTO): Promise<User> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar usuario');
    }

    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al eliminar usuario');
    }
  }
}

export const usersService = new UsersService(); 
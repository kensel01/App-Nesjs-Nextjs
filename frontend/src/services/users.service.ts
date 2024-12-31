import { CreateUserDto, UpdateUserDto, User } from '@/types/user.types';
import { ENDPOINTS } from '@/config/api';

class UsersService {
  async getUsers(): Promise<User[]> {
    const response = await fetch(ENDPOINTS.USERS.BASE);
    if (!response.ok) {
      throw new Error('Error al obtener usuarios');
    }
    return response.json();
  }

  async getUser(id: number): Promise<User> {
    const response = await fetch(`${ENDPOINTS.USERS.BASE}/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener usuario');
    }
    return response.json();
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const response = await fetch(ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear usuario');
    }
    
    return response.json();
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const response = await fetch(`${ENDPOINTS.USERS.BASE}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar usuario');
    }
    
    return response.json();
  }

  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${ENDPOINTS.USERS.BASE}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar usuario');
    }
  }
}

export const usersService = new UsersService(); 
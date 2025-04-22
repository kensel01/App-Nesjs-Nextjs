import { ENDPOINTS } from '@/config/api';
import { CreateUserDTO } from '@/types/user.types';

class AuthService {
  async login(email: string, password: string) {
    const response = await fetch(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al iniciar sesión');
    }

    return response.json();
  }

  async register(data: CreateUserDTO) {
    const response = await fetch(ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrar usuario');
    }

    return response.json();
  }

  async getProfile() {
    const response = await fetch(ENDPOINTS.AUTH.PROFILE);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener perfil');
    }

    return response.json();
  }

  async refreshToken() {
    const response = await fetch(ENDPOINTS.AUTH.REFRESH);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al refrescar token');
    }

    return response.json();
  }
}

export const authService = new AuthService(); 
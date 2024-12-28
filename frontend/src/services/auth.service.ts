import { API_URL } from '@/src/config/api';
import { CreateUserForm } from '@/src/types/user.types';

class AuthService {
  private token: string | null = null;

  constructor() {
    // Intentar recuperar el token al inicializar
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken() {
    return this.token;
  }

  async login(email: string, password: string) {
    try {
      console.log('Intentando login con:', { email });
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Respuesta de login:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en la autenticación');
      }

      // Asegurarnos de que tenemos un token
      if (!data.access_token) {
        throw new Error('No se recibió token de acceso');
      }

      this.setToken(data.access_token);
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  async register(userData: CreateUserForm) {
    try {
      const token = this.getToken();
      console.log('Token actual:', token);

      if (!token) {
        console.log('No hay token, intentando reautenticar...');
        await this.login('test@test.com', '123123');
      }

      // Obtener el token actualizado
      const currentToken = this.getToken();
      if (!currentToken) {
        throw new Error('No se pudo obtener un token válido');
      }

      console.log('Intentando registro con token:', currentToken);
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log('Respuesta de registro:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al crear el usuario');
      }

      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  async validateToken() {
    try {
      const token = this.getToken();
      console.log('Validando token:', token);

      if (!token) {
        console.log('No hay token para validar');
        return false;
      }

      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Respuesta de validación:', response.status);

      if (!response.ok) {
        console.log('Token inválido, limpiando...');
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validando token:', error);
      this.logout();
      return false;
    }
  }

  logout() {
    console.log('Ejecutando logout');
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }
}

export const authService = new AuthService(); 
import { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import { User } from '@/types/user.types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await authService.getProfile();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el usuario');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      const userData = await authService.getProfile();
      setUser(userData);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setUser(null);
      // Aquí podrías agregar la lógica para limpiar tokens o hacer logout en el backend
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cerrar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };
} 
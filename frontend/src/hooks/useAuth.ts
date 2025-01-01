'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const login = async (credentials: LoginCredentials) => {
    try {
      const result = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
        return false;
      }

      if (result?.ok) {
        toast.success('Inicio de sesión exitoso');
        router.push('/dashboard');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error en login:', error);
      toast.error('Error al iniciar sesión');
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success('Sesión cerrada correctamente');
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  return {
    login,
    logout,
    session,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
  };
}; 
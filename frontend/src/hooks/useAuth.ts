'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

interface LoginCredentials {
  email: string;
  password: string;
}

export function useAuth() {
  const router = useRouter();
  const { data: session, status } = useSession();

  console.log('useAuth - Current session:', session);
  console.log('useAuth - Session status:', status);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const result = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });

      console.log('Login result:', result);

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

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  return {
    session,
    status,
    login,
    handleLogout,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    user: session?.user,
    role: session?.user?.role,
  };
} 
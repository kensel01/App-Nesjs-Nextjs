import { signIn, signOut, useSession } from 'next-auth/react';
import { LoginFormData } from "@/schemas/auth";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  console.log('useAuth Hook Estado:', {
    status,
    isAuthenticated,
    isLoading,
    sessionData: session
  });

  const login = async (credentials: LoginFormData) => {
    try {
      console.log('Iniciando proceso de login...');
      const result = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });

      console.log('Resultado de signIn:', result);

      if (result?.error) {
        console.log('Error en signIn:', result.error);
        toast.error(result.error);
        return false;
      }

      if (result?.ok) {
        console.log('Login exitoso, intentando redirección...');
        toast.success("Inicio de sesión exitoso");
        setTimeout(() => {
          console.log('Ejecutando redirección al dashboard...');
          router.push('/dashboard');
        }, 100);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error en login:', error);
      toast.error("Error al iniciar sesión");
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Sesión cerrada");
      router.push('/login');
    } catch (error) {
      console.error('Error en logout:', error);
      toast.error("Error al cerrar sesión");
    }
  };

  return {
    session,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
} 
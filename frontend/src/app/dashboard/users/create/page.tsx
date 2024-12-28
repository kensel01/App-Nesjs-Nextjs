'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateUserForm from '@/components/users/CreateUserForm';
import { authService } from '@/src/services/auth.service';

export default function CreateUserPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        // Primero intentamos validar el token existente
        const isValid = await authService.validateToken();
        
        if (!mounted) return;

        if (!isValid) {
          // Si no hay token válido, intentamos login automático
          try {
            await authService.login('test@test.com', '123123');
            setIsLoading(false);
          } catch (error) {
            console.error('Error en login automático:', error);
            router.push('/login');
          }
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Error al verificar autenticación:', error);
        setError('Error al verificar la autenticación');
        setIsLoading(false);
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Crear Usuario</h1>
          <button
            onClick={() => router.push('/dashboard/users')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Volver a la Lista
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="bg-white shadow rounded-lg p-6">
            <CreateUserForm />
          </div>
        </div>
      </div>
    </div>
  );
} 
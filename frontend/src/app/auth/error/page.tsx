'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (!error) {
      router.push('/auth/login');
    }
  }, [error, router]);

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'CredentialsSignin':
        return 'Email o contraseña incorrectos';
      case 'AccessDenied':
        return 'No tienes permisos para acceder';
      case 'SessionRequired':
        return 'Debes iniciar sesión para acceder';
      default:
        return 'Error en la autenticación';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error de autenticación</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error ? getErrorMessage(error) : 'Error desconocido'}
        </p>
        <div className="flex gap-4">
          <Button onClick={() => router.push('/auth/login')}>
            Volver al login
          </Button>
          <Button variant="outline" onClick={() => router.push('/')}>
            Ir al inicio
          </Button>
        </div>
      </div>
    </div>
  );
} 
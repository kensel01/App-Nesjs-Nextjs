'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema } from '@/src/schemas/user.schema';
import { Role } from '@/src/types/user.types';
import type { CreateUserForm } from '@/src/types/user.types';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { authService } from '@/src/services/auth.service';
import { useRouter } from 'next/navigation';

export default function CreateUserForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = async (data: CreateUserForm) => {
    try {
      setIsLoading(true);
      setError(null);

      // Verificar autenticación antes de enviar
      const isValid = await authService.validateToken();
      if (!isValid) {
        // Intentar reautenticar
        try {
          await authService.login('test@test.com', '123123');
        } catch (error) {
          router.push('/login');
          return;
        }
      }

      await authService.register(data);
      reset();
      router.push('/dashboard/users');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error al crear el usuario');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <div className="mt-1 relative">
          <input
            {...register('name')}
            type="text"
            id="name"
            className={`form-input block w-full rounded-md sm:text-sm ${
              errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.name && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        {errors.name && (
          <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Correo Electrónico
        </label>
        <div className="mt-1 relative">
          <input
            {...register('email')}
            type="email"
            id="email"
            className={`form-input block w-full rounded-md sm:text-sm ${
              errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.email && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        {errors.email && (
          <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <div className="mt-1 relative">
          <input
            {...register('password')}
            type="password"
            id="password"
            className={`form-input block w-full rounded-md sm:text-sm ${
              errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.password && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        {errors.password && (
          <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Rol
        </label>
        <select
          {...register('role')}
          id="role"
          className={`form-select block w-full rounded-md sm:text-sm ${
            errors.role ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        >
          <option value="">Selecciona un rol</option>
          {Object.values(Role).map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Creando...' : 'Crear Usuario'}
        </button>
      </div>
    </form>
  );
} 
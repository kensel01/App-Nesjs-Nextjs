'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { tiposDeServicioService } from '@/services/tipos-de-servicio.service';

interface CreateTipoServicioDto {
  name: string;
  description?: string;
}

export default function CreateTipoServicioForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<CreateTipoServicioDto>();

  const onSubmit = async (data: CreateTipoServicioDto) => {
    setLoading(true);
    setError(null);
    try {
      if (!session) {
        throw new Error('No hay sesión activa');
      }
      await tiposDeServicioService.create(data);
      router.push('/dashboard/tipos-de-servicio');
    } catch (err) {
      console.error('Error al crear el tipo de servicio:', err);
      setError(err instanceof Error ? err.message : 'Error al crear el tipo de servicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre del Servicio
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              id="name"
              {...register('name', { required: 'El nombre es requerido' })}
              className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ease-in-out"
              placeholder="Ej: Mantenimiento Preventivo"
            />
          </div>
          {errors.name && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descripción (Opcional)
          </label>
          <div className="relative rounded-md shadow-sm">
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ease-in-out resize-none"
              placeholder="Describe el tipo de servicio..."
            />
          </div>
          {errors.description && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
        >
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando...
            </div>
          ) : (
            'Crear Tipo de Servicio'
          )}
        </button>
      </div>
    </form>
  );
} 
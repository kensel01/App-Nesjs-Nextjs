'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { CreateClienteDto, TipoDeServicio } from '@/types/cliente.types';
import { clientesService } from '@/services/clientes.service';
import { tiposDeServicioService } from '@/services/tipos-de-servicio.service';

export default function CreateClienteForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tiposDeServicio, setTiposDeServicio] = useState<TipoDeServicio[]>([]);
  const { register, handleSubmit, formState: { errors } } = useForm<CreateClienteDto>();

  useEffect(() => {
    const fetchTiposDeServicio = async () => {
      try {
        const data = await tiposDeServicioService.getAll();
        setTiposDeServicio(data);
      } catch (err) {
        console.error('Error al cargar los tipos de servicio:', err);
      }
    };

    fetchTiposDeServicio();
  }, []);

  const onSubmit = async (data: CreateClienteDto) => {
    setLoading(true);
    try {
      await clientesService.create(data);
      router.push('/dashboard/clientes');
    } catch (err) {
      console.error('Error al crear el cliente:', err);
      alert('Error al crear el cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Información Personal */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Información Personal</h3>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              {...register('name', { required: 'El nombre es requerido' })}
              className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ease-in-out"
              placeholder="Ej: Juan Pérez"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="rut" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              RUT
            </label>
            <input
              type="text"
              id="rut"
              {...register('rut', { required: 'El RUT es requerido' })}
              className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ease-in-out"
              placeholder="Ej: 12.345.678-9"
            />
            {errors.rut && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.rut.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              id="telefono"
              {...register('telefono', { required: 'El teléfono es requerido' })}
              className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ease-in-out"
              placeholder="Ej: +56 9 1234 5678"
            />
            {errors.telefono && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.telefono.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email (opcional)
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ease-in-out"
              placeholder="ejemplo@correo.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Dirección y Servicio */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Dirección y Servicio</h3>
          
          <div>
            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dirección
            </label>
            <input
              type="text"
              id="direccion"
              {...register('direccion', { required: 'La dirección es requerida' })}
              className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ease-in-out"
              placeholder="Ej: Av. Principal 123"
            />
            {errors.direccion && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.direccion.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="comuna" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comuna
            </label>
            <input
              type="text"
              id="comuna"
              {...register('comuna', { required: 'La comuna es requerida' })}
              className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ease-in-out"
              placeholder="Ej: Santiago"
            />
            {errors.comuna && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.comuna.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ciudad/Población
            </label>
            <input
              type="text"
              id="ciudad"
              {...register('ciudad', { required: 'La ciudad es requerida' })}
              className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ease-in-out"
              placeholder="Ej: Santiago"
            />
            {errors.ciudad && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.ciudad.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="tipoDeServicioId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Servicio
            </label>
            <select
              id="tipoDeServicioId"
              {...register('tipoDeServicioId', { 
                required: 'El tipo de servicio es requerido',
                valueAsNumber: true 
              })}
              className="block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-200 ease-in-out"
            >
              <option value="">Seleccione un tipo de servicio</option>
              {tiposDeServicio.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.name}
                </option>
              ))}
            </select>
            {errors.tipoDeServicioId && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.tipoDeServicioId.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6">
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
            'Crear Cliente'
          )}
        </button>
      </div>
    </form>
  );
} 
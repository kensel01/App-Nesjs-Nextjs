import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { tiposDeServicioService } from '@/services/tipos-de-servicio.service';
import { TipoDeServicio, CreateTipoDeServicioDto, UpdateTipoDeServicioDto } from '@/types/cliente.types';

// Importamos la API de tipos de servicio
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function fetchTiposDeServicio() {
  const res = await fetch(`${API_URL}/tipos-de-servicio`);
  if (!res.ok) {
    throw new Error('Error al obtener tipos de servicio');
  }
  return res.json();
}

async function createTipoDeServicio(data: CreateTipoDeServicioDto) {
  const res = await fetch(`${API_URL}/tipos-de-servicio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al crear tipo de servicio');
  }

  return res.json();
}

async function updateTipoDeServicio(id: number, data: UpdateTipoDeServicioDto) {
  const res = await fetch(`${API_URL}/tipos-de-servicio/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al actualizar tipo de servicio');
  }

  return res.json();
}

async function deleteTipoDeServicio(id: number) {
  const res = await fetch(`${API_URL}/tipos-de-servicio/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al eliminar tipo de servicio');
  }

  return true;
}

interface UseTiposDeServicioParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: keyof TipoDeServicio;
  sortOrder?: 'ASC' | 'DESC';
}

export function useTiposDeServicio(params: UseTiposDeServicioParams = {}) {
  const queryClient = useQueryClient();
  const { page = 1, limit = 10, search = '', sortBy, sortOrder } = params;

  const { data, isLoading, error } = useQuery(
    ['tipos-de-servicio', page, limit, search, sortBy, sortOrder],
    () => tiposDeServicioService.getTiposDeServicio({ page, limit, search, sortBy, sortOrder }),
    {
      staleTime: 1000 * 60 * 5, // 5 minutos
      keepPreviousData: true,
    }
  );

  const deleteMutation = useMutation(
    (id: number) => tiposDeServicioService.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tipos-de-servicio']);
      },
    }
  );

  return {
    tiposDeServicio: data?.tiposDeServicio || [],
    total: data?.total || 0,
    isLoading,
    error,
    deleteTipo: deleteMutation.mutate,
    isDeleting: deleteMutation.isLoading,
  };
} 
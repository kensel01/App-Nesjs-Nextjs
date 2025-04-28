import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
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

export function useTiposDeServicio() {
  const queryClient = useQueryClient();

  const {
    data: tiposDeServicio = [],
    isLoading,
    error,
    refetch,
  } = useQuery<TipoDeServicio[]>(['tipos-de-servicio'], fetchTiposDeServicio, {
    onError: (err: any) => {
      toast.error(`Error al cargar tipos de servicio: ${err.message}`);
    },
  });

  const createMutation = useMutation(createTipoDeServicio, {
    onSuccess: () => {
      queryClient.invalidateQueries(['tipos-de-servicio']);
      toast.success('Tipo de servicio creado correctamente');
    },
    onError: (err: any) => {
      toast.error(`Error al crear tipo de servicio: ${err.message}`);
    },
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: number; data: UpdateTipoDeServicioDto }) =>
      updateTipoDeServicio(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tipos-de-servicio']);
        toast.success('Tipo de servicio actualizado correctamente');
      },
      onError: (err: any) => {
        toast.error(`Error al actualizar tipo de servicio: ${err.message}`);
      },
    }
  );

  const deleteMutation = useMutation(deleteTipoDeServicio, {
    onSuccess: () => {
      queryClient.invalidateQueries(['tipos-de-servicio']);
      toast.success('Tipo de servicio eliminado correctamente');
    },
    onError: (err: any) => {
      toast.error(`Error al eliminar tipo de servicio: ${err.message}`);
    },
  });

  return {
    tiposDeServicio,
    isLoading,
    error,
    refetch,
    createTipoDeServicio: createMutation.mutate,
    updateTipoDeServicio: updateMutation.mutate,
    deleteTipoDeServicio: deleteMutation.mutate,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
  };
} 
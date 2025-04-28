import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientesService } from '@/services/clientes.service';
import { Cliente, CreateClienteDto, UpdateClienteDto } from '@/types/cliente.types';
import { toast } from 'sonner';

interface UseClientesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: keyof Cliente;
  sortOrder?: 'ASC' | 'DESC';
}

export function useClientes(params: UseClientesParams = {}) {
  const queryClient = useQueryClient();
  const { page = 1, limit = 10, search = '', sortBy, sortOrder } = params;

  // Query para obtener clientes con paginación, búsqueda y ordenación
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['clientes', page, limit, search, sortBy, sortOrder],
    queryFn: () => clientesService.getClientes({ page, limit, search, sortBy, sortOrder }),
    staleTime: 1000 * 60 * 5, // 5 minutos
    keepPreviousData: true,
  });

  // Mutación para crear un cliente
  const createMutation = useMutation({
    mutationFn: (newCliente: CreateClienteDto) => clientesService.create(newCliente),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast.success('Cliente creado exitosamente');
    },
    onError: (error: any) => {
      toast.error(`Error al crear cliente: ${error.message}`);
    },
  });

  // Mutación para actualizar un cliente
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateClienteDto }) => 
      clientesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast.success('Cliente actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(`Error al actualizar cliente: ${error.message}`);
    },
  });

  // Mutación para eliminar un cliente
  const deleteMutation = useMutation({
    mutationFn: (id: number) => clientesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast.success('Cliente eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(`Error al eliminar cliente: ${error.message}`);
    },
  });

  // Query para obtener un cliente por ID
  const useCliente = (id?: number) => {
    return useQuery({
      queryKey: ['cliente', id],
      queryFn: () => (id ? clientesService.getById(id) : null),
      enabled: !!id,
      staleTime: 1000 * 60 * 5, // 5 minutos
    });
  };

  return {
    clientes: data?.clientes || [],
    total: data?.total || 0,
    isLoading,
    error,
    refetch,
    createCliente: createMutation.mutate,
    isCreating: createMutation.isLoading,
    updateCliente: updateMutation.mutate,
    isUpdating: updateMutation.isLoading,
    deleteCliente: deleteMutation.mutate,
    isDeleting: deleteMutation.isLoading,
    useCliente,
  };
} 
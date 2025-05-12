import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosService } from '@/services/users.service';
import { User, CreateUserDTO, UpdateUserDTO } from '@/types/user.types';

interface UseUsuariosParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: keyof User;
  sortOrder?: 'ASC' | 'DESC';
}

export function useUsuarios(params: UseUsuariosParams = {}) {
  const queryClient = useQueryClient();
  const { page = 1, limit = 10, search = '', sortBy, sortOrder } = params;

  const {
    data,
    isLoading,
    error,
  } = useQuery(
    ['usuarios', page, limit, search, sortBy, sortOrder],
    () => usuariosService.getUsers({ page, limit, search, sortBy, sortOrder }),
    {
      staleTime: 1000 * 60 * 5, // 5 minutos
      keepPreviousData: true,
    }
  );

  const deleteMutation = useMutation(
    (id: number) => usuariosService.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['usuarios']);
      },
    }
  );

  const toggleStatusMutation = useMutation(
    (id: number) => usuariosService.toggleUserStatus(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['usuarios']);
      },
    }
  );

  return {
    usuarios: data?.users || [],
    total: data?.total || 0,
    isLoading,
    error,
    deleteUsuario: deleteMutation.mutate,
    isDeleting: deleteMutation.isLoading,
    toggleUsuarioStatus: toggleStatusMutation.mutate,
    isToggling: toggleStatusMutation.isLoading,
  };
} 
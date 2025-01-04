'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/user.types';
import { usersService } from '@/services/users.service';

interface UseUsersProps {
  page?: number;
  limit?: number;
  sortBy?: keyof User;
  sortOrder?: 'ASC' | 'DESC';
  searchQuery?: string;
  filters?: any[];
}

export function useUsers({
  page = 1,
  limit = 10,
  sortBy = 'id',
  sortOrder = 'ASC',
  searchQuery = '',
  filters = [],
}: UseUsersProps = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [page, limit, sortBy, sortOrder, searchQuery, filters]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await usersService.getAll({
        page,
        limit,
        sortBy,
        sortOrder,
        search: searchQuery,
        filters: filters.length > 0 ? JSON.stringify(filters) : undefined,
      });
      setUsers(response.users);
      setTotal(response.total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al obtener usuarios'));
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await usersService.delete(id);
      await fetchUsers();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al eliminar usuario');
    }
  };

  return {
    users,
    total,
    isLoading,
    error,
    deleteUser,
    refetch: fetchUsers,
  };
} 
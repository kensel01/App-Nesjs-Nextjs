'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UsersTable from '@/components/users/UsersTable';
import { usersService } from '@/services/users.service';
import { User } from '@/types/user.types';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<keyof User>('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await usersService.getUsers({
        page,
        limit,
        search: searchQuery,
        sortBy,
        sortOrder,
      });
      setUsers(response.users);
      setTotal(response.total);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      loadUsers();
    }
  }, [page, sortBy, sortOrder, searchQuery, status]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSort = (field: keyof User) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    try {
      await usersService.deleteUser(id);
      loadUsers();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al eliminar usuario');
    }
  };

  const handleEdit = (user: User) => {
    router.push(`/dashboard/users/edit/${user.id}`);
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <Button
            onClick={() => router.push('/dashboard/users/create')}
            className="inline-flex items-center"
          >
            <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <UsersTable
          users={users}
          total={total}
          page={page}
          limit={limit}
          onPageChange={handlePageChange}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
} 
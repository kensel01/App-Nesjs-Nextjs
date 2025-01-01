'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UsersTable from '@/components/users/UsersTable';
import { usersService } from '@/services/users.service';
import { User } from '@/types/user.types';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<keyof User>('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchQuery, setSearchQuery] = useState('');
  
  const router = useRouter();

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
    loadUsers();
  }, [page, sortBy, sortOrder, searchQuery]);

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Usuarios</h1>
          <button
            onClick={() => router.push('/dashboard/users/create')}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
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
      </div>
    </div>
  );
} 
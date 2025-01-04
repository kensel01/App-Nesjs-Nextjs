'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user.types';
import { useUsers } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'react-toastify';

export function UsersTable() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState<keyof User>('id');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchQuery, setSearchQuery] = useState('');

  const { users, total, isLoading, error, deleteUser } = useUsers({
    page,
    limit,
    sortBy,
    sortOrder,
    searchQuery,
  });

  const handleSort = (column: keyof User) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleEdit = (id: number) => {
    router.push(`/dashboard/users/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await deleteUser(id);
        toast.success('Usuario eliminado correctamente');
      } catch (error) {
        toast.error('Error al eliminar el usuario');
      }
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Buscar usuarios..."
          value={searchQuery}
          onChange={handleSearch}
          className="max-w-sm"
        />
        <Button onClick={() => router.push('/dashboard/users/create')}>
          Crear Usuario
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('id')}
              >
                ID {sortBy === 'id' && (sortOrder === 'ASC' ? '↑' : '↓')}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Nombre {sortBy === 'name' && (sortOrder === 'ASC' ? '↑' : '↓')}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('email')}
              >
                Email {sortBy === 'email' && (sortOrder === 'ASC' ? '↑' : '↓')}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('role')}
              >
                Rol {sortBy === 'role' && (sortOrder === 'ASC' ? '↑' : '↓')}
              </TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No hay usuarios
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user.id)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <div>
          Total: {total} usuarios
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page * limit >= total}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
} 
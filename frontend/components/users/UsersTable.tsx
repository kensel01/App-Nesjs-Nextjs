'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Role } from '@/types/user.types';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { toast } from 'react-toastify';

interface UsersTableProps {
  users: User[];
  onDelete: (id: number) => Promise<void>;
}

export default function UsersTable({ users, onDelete }: UsersTableProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEdit = (id: number) => {
    router.push(`/dashboard/users/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await onDelete(id);
      toast.success('Usuario eliminado correctamente');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error instanceof Error ? error.message : 'Error al eliminar usuario');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return 'Administrador';
      case Role.USER:
        return 'Usuario';
      case Role.TECHNICIAN:
        return 'Técnico';
      default:
        return role;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{getRoleLabel(user.role)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => handleEdit(user.id)}
                    disabled={loading}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(user.id)}
                    disabled={loading}
                    className="text-red-600"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 
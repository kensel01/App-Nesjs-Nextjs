'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Cliente } from '@/types/cliente.types';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Pencil, 
  Trash,
  Search,
  ArrowUpDown
} from 'lucide-react';
import { toast } from 'react-toastify';

interface ClientesTableProps {
  clientes: Cliente[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onDelete: (id: number) => Promise<void>;
  onEdit: (cliente: Cliente) => void;
  onSort: (field: keyof Cliente) => void;
  sortBy: keyof Cliente;
  sortOrder: 'ASC' | 'DESC';
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function ClientesTable({
  clientes = [],
  total,
  page,
  limit,
  onPageChange,
  onDelete,
  onEdit,
  onSort,
  sortBy,
  sortOrder,
  onSearch,
  isLoading,
}: ClientesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleSort = (field: keyof Cliente) => {
    onSort(field);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          type="search"
          placeholder="Buscar clientes..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center">
                  ID
                  {sortBy === 'id' && (
                    <span className="ml-1">
                      {sortOrder === 'ASC' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Nombre
                  {sortBy === 'name' && (
                    <span className="ml-1">
                      {sortOrder === 'ASC' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('rut')}
              >
                <div className="flex items-center">
                  RUT
                  {sortBy === 'rut' && (
                    <span className="ml-1">
                      {sortOrder === 'ASC' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Comuna</TableHead>
              <TableHead>Ciudad</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('tipoDeServicio')}
              >
                <div className="flex items-center">
                  Tipo de Servicio
                  {sortBy === 'tipoDeServicio' && (
                    <span className="ml-1">
                      {sortOrder === 'ASC' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(!clientes || clientes.length === 0) ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  No hay clientes registrados
                </TableCell>
              </TableRow>
            ) : (
              clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.id}</TableCell>
                  <TableCell>{cliente.name}</TableCell>
                  <TableCell>{cliente.rut}</TableCell>
                  <TableCell>{cliente.telefono}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.direccion}</TableCell>
                  <TableCell>{cliente.comuna}</TableCell>
                  <TableCell>{cliente.ciudad}</TableCell>
                  <TableCell>{cliente.tipoDeServicio?.name}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(cliente)}
                      className="mr-2"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(cliente.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {total > limit && (
        <div className="flex justify-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="mx-2">
            Página {page} de {Math.ceil(total / limit)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === Math.ceil(total / limit)}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
} 
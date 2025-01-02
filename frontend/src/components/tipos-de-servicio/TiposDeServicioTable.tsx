'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TipoDeServicio } from '@/types/cliente.types';
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
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface TiposDeServicioTableProps {
  tiposDeServicio: TipoDeServicio[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onDelete: (id: number) => void;
  onEdit: (tipoDeServicio: TipoDeServicio) => void;
  onSort: (field: keyof TipoDeServicio) => void;
  sortBy: keyof TipoDeServicio;
  sortOrder: 'ASC' | 'DESC';
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function TiposDeServicioTable({
  tiposDeServicio,
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
}: TiposDeServicioTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const totalPages = Math.ceil(total / limit);

  const handleSort = (field: keyof TipoDeServicio) => {
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
          placeholder="Buscar tipos de servicio..."
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
                onClick={() => handleSort('description')}
              >
                <div className="flex items-center">
                  Descripción
                  {sortBy === 'description' && (
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
            {tiposDeServicio.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No hay tipos de servicio registrados
                </TableCell>
              </TableRow>
            ) : (
              tiposDeServicio.map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell>{tipo.name}</TableCell>
                  <TableCell>{tipo.description}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(tipo)}
                      className="mr-2"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(tipo.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
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
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
} 
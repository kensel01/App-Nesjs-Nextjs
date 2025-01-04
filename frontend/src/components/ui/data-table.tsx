'use client';

import * as React from 'react';
import { useState } from 'react';
import { Search, ArrowUpDown, MoreHorizontal, Pencil, Trash } from 'lucide-react';
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
import { TableProps, Column } from '@/types/table.types';
import { AdvancedFilters } from '@/components/ui/advanced-filters';
import { Filter, FilterOption } from '@/types/filter.types';
import { Resource } from '@/types/permission.types';
import { usePermissions } from '@/hooks/usePermissions';

interface ExtendedTableProps<T> extends TableProps<T> {
  filterOptions?: FilterOption<T>[];
  onFilterChange?: (filters: Filter<T>[]) => void;
  resource: Resource;
}

export function DataTable<T extends object>({
  data,
  columns,
  total,
  page,
  limit,
  sortBy,
  sortOrder = 'ASC',
  isLoading = false,
  searchPlaceholder = 'Buscar...',
  filterOptions,
  resource,
  onPageChange,
  onSort,
  onSearch,
  onFilterChange,
  onEdit,
  onDelete,
  getItemId,
}: ExtendedTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const totalPages = Math.ceil(total / limit);
  const { check } = usePermissions();

  const canUpdate = check(resource, 'update');
  const canDelete = check(resource, 'delete');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleSort = (field: keyof T) => {
    onSort?.(field);
  };

  const handleDelete = async (id: number) => {
    if (!onDelete || !canDelete) return;
    try {
      setLoading(true);
      await onDelete(id);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearch}
              className="pl-8 w-[300px]"
            />
          </div>
          {filterOptions && onFilterChange && (
            <AdvancedFilters
              filterOptions={filterOptions}
              onFilterChange={onFilterChange}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => onPageChange(page > 1 ? page - 1 : 1)}
            disabled={page === 1 || isLoading}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
          >
            Siguiente
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50 dark:hover:bg-muted/50">
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={column.sortable ? 'cursor-pointer' : ''}
                >
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-1 font-semibold -ml-4"
                    >
                      {column.label}
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
              {(canUpdate || canDelete) && (
                <TableHead className="text-right">Acciones</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + ((canUpdate || canDelete) ? 1 : 0)}
                  className="text-center py-10 text-muted-foreground"
                >
                  No se encontraron registros
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow
                  key={getItemId(item)}
                  className="hover:bg-muted/50 dark:hover:bg-muted/50"
                >
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      {column.render
                        ? column.render(item[column.key], item)
                        : String(item[column.key] || '')}
                    </TableCell>
                  ))}
                  {(canUpdate || canDelete) && (
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
                          {canUpdate && onEdit && (
                            <DropdownMenuItem
                              onClick={() => onEdit(item)}
                              disabled={loading}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Pencil className="h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                          )}
                          {canDelete && onDelete && (
                            <DropdownMenuItem
                              onClick={() => handleDelete(getItemId(item))}
                              disabled={loading}
                              className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                            >
                              <Trash className="h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 
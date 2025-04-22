'use client';

import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, ArrowUpDown, MoreHorizontal, Pencil, Trash, ChevronLeft, ChevronRight } from 'lucide-react';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableProps, Column } from '@/types/table.types';
import { AdvancedFilters } from '@/components/ui/advanced-filters';
import { Filter, FilterOption } from '@/types/filter.types';
import { Resource } from '@/types/permission.types';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent } from '@/components/ui/card';

interface ExtendedTableProps<T, IdType = number> extends TableProps<T, IdType> {
  filterOptions?: FilterOption<T>[];
  onFilterChange?: (filters: Filter<T>[]) => void;
  resource: Resource;
}

export function DataTable<T extends object, IdType extends React.Key = number>({
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
}: ExtendedTableProps<T, IdType>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const { check } = usePermissions();
  
  // Memoize permission checks
  const canUpdate = useMemo(() => check(resource, 'update'), [check, resource]);
  const canDelete = useMemo(() => check(resource, 'delete'), [check, resource]);
  
  // Calculate pagination values
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);
  const hasPrevPage = useMemo(() => currentPage > 1, [currentPage]);
  const hasNextPage = useMemo(() => currentPage < totalPages, [currentPage, totalPages]);
  
  // Detectar si es móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Update internal page when prop changes
  useEffect(() => {
    setCurrentPage(page);
  }, [page]);
  
  // Handle sorting callback
  const handleSort = useCallback((columnKey: any) => {
    if (onSort) {
      onSort(columnKey);
    }
  }, [onSort]);
  
  // Handle search query change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);
  
  // Handle search submission
  const handleSearch = useCallback(() => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  }, [searchQuery, onSearch]);
  
  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    if (onPageChange) {
      onPageChange(newPage);
    }
  }, [onPageChange]);
  
  // Handle filter changes
  const handleFilterChange = useCallback((filters: Filter<T>[]) => {
    if (onFilterChange) {
      setShowFilters(false);
      onFilterChange(filters);
    }
  }, [onFilterChange]);
  
  // Callback for Enter key in search
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  // Handle delete item
  const handleDelete = useCallback(async (id: IdType) => {
    if (!onDelete || !canDelete) return;
    try {
      setLoading(true);
      await onDelete(id);
    } finally {
      setLoading(false);
    }
  }, [onDelete, canDelete]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render mobile view (cards)
  const renderMobileView = useCallback(() => {
    return (
      <div className="space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No se encontraron registros
          </div>
        ) : (
          data.map((item) => (
            <Card key={getItemId(item)} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 bg-muted/30">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">
                      {String(item[columns[0].key] || item[columns[1].key] || '')}
                    </div>
                    {(canUpdate || canDelete) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {canUpdate && onEdit && (
                            <DropdownMenuItem
                              onClick={() => onEdit(getItemId(item) as any)}
                              className="cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </DropdownMenuItem>
                          )}
                          {canDelete && onDelete && (
                            <DropdownMenuItem
                              onClick={() => handleDelete(getItemId(item))}
                              className="cursor-pointer text-destructive focus:text-destructive"
                              disabled={loading}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Eliminar</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  {columns.slice(1).map((column) => (
                    <div key={String(column.key)} className="py-1">
                      <div className="text-sm text-muted-foreground">{column.label}</div>
                      <div>{String(item[column.key] || '-')}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  }, [data, columns, getItemId, canUpdate, canDelete, onEdit, handleDelete, loading]);

  // Render desktop view (table)
  const renderDesktopView = useCallback(() => {
    return (
      <div className="rounded-md border bg-card overflow-x-auto">
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
                  colSpan={columns.length + (canUpdate || canDelete ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No se encontraron registros
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={getItemId(row)}>
                  {columns.map((column) => (
                    <TableCell key={`${getItemId(row)}-${String(column.key)}`}>
                      {String(row[column.key] || '-')}
                    </TableCell>
                  ))}
                  {(canUpdate || canDelete) && (
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        {canUpdate && onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(getItemId(row) as any)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                        )}
                        {canDelete && onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(getItemId(row))}
                            disabled={loading}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    );
  }, [data, columns, getItemId, sortBy, sortOrder, handleSort, canUpdate, canDelete, onEdit, loading, handleDelete]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="pl-8 w-full"
          />
        </div>
        <div className="flex gap-2">
          {filterOptions && filterOptions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtros
            </Button>
          )}
          <Button 
            variant="default" 
            size="sm"
            onClick={handleSearch}
          >
            Buscar
          </Button>
        </div>
      </div>

      {filterOptions && showFilters && (
        <AdvancedFilters
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
        />
      )}

      {isMobile ? renderMobileView() : renderDesktopView()}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Total: {total} registros
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={!hasPrevPage || isLoading || loading}
              className="px-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {currentPage} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNextPage || isLoading || loading}
              className="px-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 
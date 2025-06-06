'use client';

import { TipoDeServicio } from '@/types/cliente.types';
import { DataTable } from '@/components/ui/data-table';
import { Column } from '@/types/table.types';
import { FilterOption } from '@/types/filter.types';
import { toast } from 'react-toastify';

interface TiposDeServicioTableProps {
  tiposDeServicio: TipoDeServicio[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onDelete: (id: number) => Promise<void>;
  onEdit: (tipoDeServicio: TipoDeServicio) => void;
  onSort: (field: keyof TipoDeServicio) => void;
  sortBy: keyof TipoDeServicio;
  sortOrder: 'ASC' | 'DESC';
  onSearch: (query: string) => void;
  onFilter: (filters: any[]) => void;
  isLoading: boolean;
}

const filterOptions: FilterOption<TipoDeServicio>[] = [
  {
    field: 'name',
    label: 'Nombre',
    type: 'text',
    operators: ['equals', 'contains', 'startsWith', 'endsWith'],
  },
];

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
  onFilter,
  isLoading,
}: TiposDeServicioTableProps) {
  const columns: Column<TipoDeServicio>[] = [
    { key: 'name', label: 'Nombre', sortable: true },
  ];

  const handleDelete = async (id: number) => {
    try {
      await onDelete(id);
      toast.success('Tipo de servicio eliminado correctamente');
    } catch (error) {
      console.error('Error deleting service type:', error);
      toast.error(error instanceof Error ? error.message : 'Error al eliminar tipo de servicio');
    }
  };
  
  const handleEdit = (id: number) => {
    const tipoDeServicio = tiposDeServicio.find(t => t.id === id);
    if (tipoDeServicio) {
      onEdit(tipoDeServicio);
    }
  };

  return (
    <DataTable<TipoDeServicio, number>
      data={tiposDeServicio}
      columns={columns}
      total={total}
      page={page}
      limit={limit}
      sortBy={sortBy}
      sortOrder={sortOrder}
      isLoading={isLoading}
      searchPlaceholder="Buscar tipos de servicio..."
      filterOptions={filterOptions}
      resource="service-types"
      onPageChange={onPageChange}
      onSort={onSort}
      onSearch={onSearch}
      onFilterChange={onFilter}
      onEdit={handleEdit}
      onDelete={handleDelete}
      getItemId={(tipo) => tipo.id}
    />
  );
} 
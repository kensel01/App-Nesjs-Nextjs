'use client';

import { Cliente } from '@/types/cliente.types';
import { DataTable } from '@/components/ui/data-table';
import { Column } from '@/types/table.types';
import { FilterOption } from '@/types/filter.types';
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
  onFilter: (filters: any[]) => void;
  isLoading: boolean;
}

const filterOptions: FilterOption<Cliente>[] = [
  {
    field: 'name',
    label: 'Nombre',
    type: 'text',
    operators: ['equals', 'contains', 'startsWith', 'endsWith'],
  },
  {
    field: 'rut',
    label: 'RUT',
    type: 'text',
    operators: ['equals', 'contains'],
  },
  {
    field: 'telefono',
    label: 'Teléfono',
    type: 'text',
    operators: ['equals', 'contains'],
  },
  {
    field: 'email',
    label: 'Email',
    type: 'text',
    operators: ['equals', 'contains', 'startsWith', 'endsWith'],
  },
  {
    field: 'direccion',
    label: 'Dirección',
    type: 'text',
    operators: ['contains'],
  },
  {
    field: 'comuna',
    label: 'Comuna',
    type: 'text',
    operators: ['equals', 'contains'],
  },
  {
    field: 'ciudad',
    label: 'Ciudad',
    type: 'text',
    operators: ['equals', 'contains'],
  },
];

export default function ClientesTable({
  clientes,
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
}: ClientesTableProps) {
  const columns: Column<Cliente>[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'rut', label: 'RUT', sortable: true },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
    { key: 'direccion', label: 'Dirección' },
    { key: 'comuna', label: 'Comuna' },
    { key: 'ciudad', label: 'Ciudad' },
    {
      key: 'tipoDeServicio',
      label: 'Tipo de Servicio',
      sortable: true,
      render: (tipoDeServicio) => tipoDeServicio?.name || '',
    },
  ];

  const handleDelete = async (id: number) => {
    try {
      await onDelete(id);
      toast.success('Cliente eliminado correctamente');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error(error instanceof Error ? error.message : 'Error al eliminar cliente');
    }
  };

  const handleEdit = (id: number) => {
    const cliente = clientes.find(c => c.id === id);
    if (cliente) {
      onEdit(cliente);
    }
  };

  return (
    <DataTable<Cliente, number>
      data={clientes}
      columns={columns}
      total={total}
      page={page}
      limit={limit}
      sortBy={sortBy}
      sortOrder={sortOrder}
      isLoading={isLoading}
      searchPlaceholder="Buscar clientes..."
      filterOptions={filterOptions}
      resource="clients"
      onPageChange={onPageChange}
      onSort={onSort}
      onSearch={onSearch}
      onFilterChange={onFilter}
      onEdit={handleEdit}
      onDelete={handleDelete}
      getItemId={(cliente) => cliente.id}
    />
  );
} 
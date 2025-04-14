'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ClientesTable from '@/components/clientes/ClientesTable';
import { clientesService } from '@/services/clientes.service';
import { Cliente } from '@/types/cliente.types';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

export default function ClientesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<keyof Cliente>('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Detectar si es móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadClientes = async () => {
    try {
      setIsLoading(true);
      const response = await clientesService.getClientes({
        page,
        limit,
        search: searchQuery,
        sortBy,
        sortOrder,
      });
      setClientes(response.clientes);
      setTotal(response.total);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cargar clientes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      loadClientes();
    }
  }, [page, sortBy, sortOrder, searchQuery, status]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSort = (field: keyof Cliente) => {
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

  const handleFilter = (filters: any[]) => {
    // Implementar la lógica de filtrado si es necesario
    console.log('Filtros aplicados:', filters);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      return;
    }

    try {
      await clientesService.delete(id);
      loadClientes();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al eliminar cliente');
    }
  };

  const handleEdit = (cliente: Cliente) => {
    router.push(`/dashboard/clientes/edit/${cliente.id}`);
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row justify-between'} items-start sm:items-center mb-4 gap-3`}>
        <h1 className="text-xl sm:text-2xl font-bold">Clientes</h1>
        <Button
          onClick={() => router.push('/dashboard/clientes/create')}
          className="inline-flex items-center text-sm sm:text-base py-1 sm:py-2 w-full sm:w-auto justify-center"
        >
          <PlusIcon className="mr-1 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 p-3 sm:p-4 rounded-lg text-sm">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <ClientesTable
        clientes={clientes}
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
        onFilter={handleFilter}
        isLoading={isLoading}
      />
    </div>
  );
} 
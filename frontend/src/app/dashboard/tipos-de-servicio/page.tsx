'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TiposDeServicioTable from '@/components/tipos-de-servicio/TiposDeServicioTable';
import { tiposDeServicioService } from '@/services/tipos-de-servicio.service';
import { TipoDeServicio } from '@/types/cliente.types';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

export default function TiposDeServicioPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tiposDeServicio, setTiposDeServicio] = useState<TipoDeServicio[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<keyof TipoDeServicio>('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const loadTiposDeServicio = async () => {
    try {
      setIsLoading(true);
      const response = await tiposDeServicioService.getTiposDeServicio({
        page,
        limit,
        search: searchQuery,
        sortBy,
        sortOrder,
      });
      setTiposDeServicio(response.tiposDeServicio);
      setTotal(response.total);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cargar tipos de servicio');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      loadTiposDeServicio();
    }
  }, [page, sortBy, sortOrder, searchQuery, status]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSort = (field: keyof TipoDeServicio) => {
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
    if (!confirm('¿Estás seguro de que deseas eliminar este tipo de servicio?')) {
      return;
    }

    try {
      await tiposDeServicioService.delete(id);
      loadTiposDeServicio();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al eliminar tipo de servicio');
    }
  };

  const handleEdit = (tipoDeServicio: TipoDeServicio) => {
    router.push(`/dashboard/tipos-de-servicio/edit/${tipoDeServicio.id}`);
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tipos de Servicio</h1>
        <Button
          onClick={() => router.push('/dashboard/tipos-de-servicio/create')}
          className="inline-flex items-center"
        >
          <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" />
          Nuevo Tipo de Servicio
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <TiposDeServicioTable
        tiposDeServicio={tiposDeServicio}
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
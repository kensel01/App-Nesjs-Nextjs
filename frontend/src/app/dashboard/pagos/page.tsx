'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePayments } from '@/hooks/usePayments';
import { PaymentStatus } from '@/types/payment.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '../../../components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchIcon, FilterIcon, RefreshCw, PlusIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreatePaymentForm } from '@/components/payments/CreatePaymentForm';
import { useClientes } from '@/hooks/useClientes';
import { useTiposDeServicio } from '@/hooks/useTiposDeServicio';
import { PaymentDetails } from '@/components/payments/PaymentDetails';

const statusColors = {
  [PaymentStatus.COMPLETED]: 'bg-green-500/10 text-green-500 border-green-500/20',
  [PaymentStatus.APPROVED]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  [PaymentStatus.PENDING]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  [PaymentStatus.REJECTED]: 'bg-red-500/10 text-red-500 border-red-500/20',
  [PaymentStatus.FAILED]: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

export default function PaymentsPage() {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    transactionId: searchParams.get('transactionId') || '',
    clienteId: searchParams.get('clienteId') || '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  
  const { payments, meta, isLoading, refetch } = usePayments(
    currentPage,
    10,
    { ...filters, search: searchTerm }
  );

  const { clientes, isLoading: clientesLoading } = useClientes();
  const { tiposDeServicio, isLoading: serviciosLoading } = useTiposDeServicio();

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  function handleFilterChange(key: string, value: string) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    refetch();
  }

  function getStatusBadge(status: PaymentStatus) {
    return (
      <Badge variant="outline" className={statusColors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  }

  function handlePaymentClick(transactionId: string) {
    setSelectedPayment(transactionId);
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Pagos</h1>
          <p className="text-muted-foreground">
            Administra y consulta el estado de los pagos
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Nuevo Pago
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Registrar pago</DialogTitle>
                <DialogDescription>
                  Complete los datos para registrar un pago o iniciar el proceso de pago en línea.
                </DialogDescription>
              </DialogHeader>
              <CreatePaymentForm 
                clientes={clientes}
                servicios={tiposDeServicio}
                onSuccess={() => {
                  setIsDialogOpen(false);
                  refetch();
                }}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refrescar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de búsqueda</CardTitle>
          <CardDescription>Filtra los pagos por diferentes criterios</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transactionId">ID de Transacción</Label>
              <Input
                id="transactionId"
                placeholder="Buscar por ID de transacción"
                value={filters.transactionId}
                onChange={(e) => handleFilterChange('transactionId', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clienteId">ID de Cliente</Label>
              <Input
                id="clienteId"
                placeholder="Buscar por ID de cliente"
                value={filters.clienteId}
                onChange={(e) => handleFilterChange('clienteId', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {Object.values(PaymentStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 flex items-end">
              <Button type="submit" className="w-full">
                <SearchIcon className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Pagos</CardTitle>
          <CardDescription>
            {meta?.total ? `Mostrando ${payments.length} de ${meta.total} pagos` : 'No hay pagos disponibles'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">ID Transacción</th>
                    <th className="text-left py-3 px-4 font-medium">Cliente</th>
                    <th className="text-left py-3 px-4 font-medium">Servicio</th>
                    <th className="text-left py-3 px-4 font-medium">Monto</th>
                    <th className="text-left py-3 px-4 font-medium">Estado</th>
                    <th className="text-left py-3 px-4 font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr 
                      key={payment.id} 
                      className="border-b hover:bg-muted/50 cursor-pointer"
                      onClick={() => handlePaymentClick(payment.transactionId)}
                    >
                      <td className="py-3 px-4 font-mono text-xs">{payment.transactionId}</td>
                      <td className="py-3 px-4">
                        {payment.cliente ? (
                          <div>
                            <div className="font-medium">{payment.cliente.name}</div>
                            <div className="text-muted-foreground text-xs">{payment.cliente.rut}</div>
                          </div>
                        ) : (
                          `Cliente #${payment.clienteId}`
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {payment.servicio ? payment.servicio.name : `Servicio #${payment.servicioId}`}
                      </td>
                      <td className="py-3 px-4">{formatCurrency(payment.amount)}</td>
                      <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                      <td className="py-3 px-4">
                        <div className="text-xs">
                          {new Date(payment.createdAt).toLocaleDateString()}
                          <div className="text-muted-foreground">
                            {new Date(payment.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No se encontraron pagos con los filtros seleccionados</p>
            </div>
          )}

          {meta && meta.total > 0 && (
            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(meta.total / (meta.limit || 10))}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalles del Pago</DialogTitle>
            <DialogDescription>
              Información detallada de la transacción
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <PaymentDetails 
              transactionId={selectedPayment} 
              onClose={() => setSelectedPayment(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 
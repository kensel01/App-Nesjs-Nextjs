import { useState, useEffect } from 'react';
import { Payment, PaymentStatus } from '@/types/payment.types';
import { usePayments } from '@/hooks/usePayments';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { AlertTriangleIcon, CheckCircleIcon, ClockIcon } from 'lucide-react';

interface PaymentDetailsProps {
  transactionId: string;
  onClose?: () => void;
}

const statusColors = {
  [PaymentStatus.COMPLETED]: 'bg-green-500/10 text-green-500 border-green-500/20',
  [PaymentStatus.APPROVED]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  [PaymentStatus.PENDING]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  [PaymentStatus.REJECTED]: 'bg-red-500/10 text-red-500 border-red-500/20',
  [PaymentStatus.FAILED]: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

const statusIcons = {
  [PaymentStatus.COMPLETED]: <CheckCircleIcon className="h-10 w-10 text-green-500" />,
  [PaymentStatus.APPROVED]: <CheckCircleIcon className="h-10 w-10 text-blue-500" />,
  [PaymentStatus.PENDING]: <ClockIcon className="h-10 w-10 text-yellow-500" />,
  [PaymentStatus.REJECTED]: <AlertTriangleIcon className="h-10 w-10 text-red-500" />,
  [PaymentStatus.FAILED]: <AlertTriangleIcon className="h-10 w-10 text-gray-500" />,
};

export function PaymentDetails({ transactionId, onClose }: PaymentDetailsProps) {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getPaymentStatus } = usePayments();

  useEffect(() => {
    async function fetchPaymentStatus() {
      try {
        setLoading(true);
        setError(null);
        
        // Simulamos la obtención del pago con los datos que tenemos
        // En una implementación real, haríamos una llamada al backend
        const status = await getPaymentStatus(transactionId);
        
        // Simulamos un pago para mostrar
        const mockPayment: Payment = {
          id: 1,
          transactionId,
          amount: 25000,
          status,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          processedAt: status === PaymentStatus.PENDING ? null : new Date().toISOString(),
          clienteId: 1,
          servicioId: 1,
          cliente: {
            id: 1,
            name: 'Cliente de Ejemplo',
            rut: '12.345.678-9',
            telefono: '+56912345678',
            direccion: 'Calle Ejemplo 123',
            comuna: 'La Serena',
            ciudad: 'La Serena',
            tipoDeServicioId: 1,
          },
          servicio: {
            id: 1,
            name: 'Internet 100 Mbps',
            descripcion: 'Servicio de internet de alta velocidad',
            precio: 25000,
          },
        };
        
        setPayment(mockPayment);
      } catch (err: any) {
        setError(err.message || 'Error al obtener detalles del pago');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPaymentStatus();
  }, [transactionId, getPaymentStatus]);

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-40 mb-4" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <AlertTriangleIcon className="h-10 w-10 text-red-500 mx-auto mb-2" />
        <h3 className="text-lg font-semibold">Error</h3>
        <p className="text-muted-foreground">{error}</p>
        <Button variant="outline" className="mt-4" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="p-4 text-center">
        <AlertTriangleIcon className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
        <h3 className="text-lg font-semibold">Pago no encontrado</h3>
        <p className="text-muted-foreground">
          No se encontró información para el ID de transacción {transactionId}
        </p>
        <Button variant="outline" className="mt-4" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Transacción: <span className="font-mono">{payment.transactionId}</span>
          </h3>
          <p className="text-muted-foreground text-sm">
            {new Date(payment.createdAt).toLocaleDateString()} {new Date(payment.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <Badge className={statusColors[payment.status]} variant="outline">
          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
        </Badge>
      </div>

      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
        {statusIcons[payment.status]}
        <div>
          <div className="font-medium">{payment.amount ? formatCurrency(payment.amount) : 'Monto no disponible'}</div>
          <div className="text-sm text-muted-foreground">
            {payment.status === PaymentStatus.COMPLETED && 'Pago completado exitosamente'}
            {payment.status === PaymentStatus.APPROVED && 'Pago aprobado'}
            {payment.status === PaymentStatus.PENDING && 'Pago en proceso'}
            {payment.status === PaymentStatus.REJECTED && 'Pago rechazado'}
            {payment.status === PaymentStatus.FAILED && 'Pago fallido'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Cliente</h4>
          {payment.cliente ? (
            <div className="p-3 border rounded-md">
              <div className="font-medium">{payment.cliente.name}</div>
              <div className="text-sm text-muted-foreground">{payment.cliente.rut}</div>
            </div>
          ) : (
            <div className="p-3 border rounded-md text-muted-foreground">
              Cliente #{payment.clienteId}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Servicio</h4>
          {payment.servicio ? (
            <div className="p-3 border rounded-md">
              <div className="font-medium">{payment.servicio.name}</div>
              <div className="text-sm text-muted-foreground">{formatCurrency(payment.servicio.precio)}</div>
            </div>
          ) : (
            <div className="p-3 border rounded-md text-muted-foreground">
              Servicio #{payment.servicioId}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Fecha de creación</h4>
          <div className="p-3 border rounded-md">
            {new Date(payment.createdAt).toLocaleDateString()} {new Date(payment.createdAt).toLocaleTimeString()}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Fecha de procesamiento</h4>
          <div className="p-3 border rounded-md">
            {payment.processedAt 
              ? `${new Date(payment.processedAt).toLocaleDateString()} ${new Date(payment.processedAt).toLocaleTimeString()}`
              : 'Pendiente de procesamiento'
            }
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </div>
  );
} 
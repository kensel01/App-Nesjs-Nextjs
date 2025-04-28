import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PaymentsService } from '@/services/payments.service';
import { Payment, PaymentStatus } from '@/types/payment.types';
import { useToast } from '@/components/ui/use-toast';

const paymentsService = new PaymentsService();

export function usePayments(page = 1, limit = 10, filters: Record<string, any> = {}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ['payments', page, limit, filters],
    () => paymentsService.getPayments(page, limit, filters),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutos
      onError: (err: any) => {
        toast({
          title: 'Error',
          description: `No se pudieron cargar los pagos: ${err.message}`,
          variant: 'destructive',
        });
      },
    }
  );

  const createPaymentMutation = useMutation(
    (paymentData: { clienteId: number; servicioId: number; amount: number }) =>
      paymentsService.createPayment(paymentData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['payments']);
        toast({
          title: 'Pago procesado',
          description: 'El pago se ha procesado correctamente',
        });
      },
      onError: (err: any) => {
        toast({
          title: 'Error',
          description: `Error al procesar el pago: ${err.message}`,
          variant: 'destructive',
        });
      },
    }
  );

  const getPaymentStatus = async (transactionId: string): Promise<PaymentStatus> => {
    try {
      const response = await paymentsService.checkPaymentStatus(transactionId);
      return response.status;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Error al verificar el estado del pago: ${error.message}`,
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    payments: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    refetch,
    createPayment: createPaymentMutation.mutate,
    isCreating: createPaymentMutation.isLoading,
    getPaymentStatus,
  };
} 
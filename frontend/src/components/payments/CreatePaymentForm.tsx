'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePayments } from '@/hooks/usePayments';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCardIcon, ArrowRightIcon, CheckCircleIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const formSchema = z.object({
  clienteId: z.string().min(1, 'Seleccione un cliente'),
  servicioId: z.string().min(1, 'Seleccione un servicio'),
  amount: z.string().min(1, 'Ingrese un monto'),
});

type FormValues = z.infer<typeof formSchema>;

interface CreatePaymentFormProps {
  clientes?: { id: number; name: string; rut: string }[];
  servicios?: { id: number; name: string; precio: number }[];
  clienteId?: number;
  servicioId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreatePaymentForm({
  clientes = [],
  servicios = [],
  clienteId,
  servicioId,
  onSuccess,
  onCancel,
}: CreatePaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPayment, isCreating } = usePayments();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clienteId: clienteId ? String(clienteId) : '',
      servicioId: servicioId ? String(servicioId) : '',
      amount: '',
    },
  });

  // Actualizar el monto automáticamente cuando se selecciona un servicio
  useEffect(() => {
    const watchServicioId = form.watch('servicioId');
    if (watchServicioId) {
      const selectedServicio = servicios.find(
        (servicio) => servicio.id === parseInt(watchServicioId)
      );
      if (selectedServicio) {
        form.setValue('amount', String(selectedServicio.precio));
      }
    }
  }, [form.watch('servicioId'), servicios, form]);

  function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    
    createPayment({
      clienteId: parseInt(data.clienteId),
      servicioId: parseInt(data.servicioId),
      amount: parseFloat(data.amount),
    }, {
      onSuccess: () => {
        setIsSubmitting(false);
        if (onSuccess) onSuccess();
      },
      onError: () => {
        setIsSubmitting(false);
      }
    });
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCardIcon className="h-5 w-5" />
          Nuevo Pago
        </CardTitle>
        <CardDescription>
          Registre un nuevo pago o inicie el proceso de pago en línea
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clienteId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    disabled={isSubmitting || !!clienteId}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={String(cliente.id)}>
                          {cliente.name} ({cliente.rut})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="servicioId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servicio</FormLabel>
                  <Select
                    disabled={isSubmitting || !!servicioId}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar servicio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {servicios.map((servicio) => (
                        <SelectItem key={servicio.id} value={String(servicio.id)}>
                          {servicio.name} - {formatCurrency(servicio.precio)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      type="number"
                      placeholder="0"
                      min="1"
                      step="any"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <div className="space-x-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-1"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  Registrar Pago
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  className="gap-1"
                  onClick={() => {
                    // Aquí iría la redirección a la pasarela de pagos
                    alert('Redirección a pasarela de pagos (a implementar)');
                  }}
                >
                  Pago en línea
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 
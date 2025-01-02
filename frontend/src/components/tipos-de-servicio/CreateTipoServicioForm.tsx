'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { tiposDeServicioService } from '@/services/tipos-de-servicio.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { tipoDeServicioFormSchema } from '@/lib/validations/tipo-de-servicio';
import type { z } from 'zod';

type CreateTipoDeServicioForm = z.infer<typeof tipoDeServicioFormSchema>;

export default function CreateTipoServicioForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateTipoDeServicioForm>({
    resolver: zodResolver(tipoDeServicioFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: CreateTipoDeServicioForm) => {
    try {
      setIsLoading(true);
      await tiposDeServicioService.create(data);
      toast.success('Tipo de servicio creado correctamente');
      router.push('/dashboard/tipos-de-servicio');
    } catch (error) {
      console.error('Error creating service type:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear el tipo de servicio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Tipo de Servicio</CardTitle>
        <CardDescription>
          Ingresa los datos del nuevo tipo de servicio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nombre del tipo de servicio" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Descripción del tipo de servicio" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/tipos-de-servicio')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creando...' : 'Crear Tipo de Servicio'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 
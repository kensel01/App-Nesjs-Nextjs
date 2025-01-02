'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { clientesService } from '@/services/clientes.service';
import { tiposDeServicioService } from '@/services/tipos-de-servicio.service';
import { TipoDeServicio } from '@/types/cliente.types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { clienteFormSchema } from '@/lib/validations/cliente';
import type { z } from 'zod';

type CreateClienteForm = z.infer<typeof clienteFormSchema>;

export default function CreateClienteForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [tiposDeServicio, setTiposDeServicio] = useState<TipoDeServicio[]>([]);

  const form = useForm<CreateClienteForm>({
    resolver: zodResolver(clienteFormSchema),
    defaultValues: {
      name: '',
      rut: '',
      telefono: '',
      email: '',
      direccion: '',
      comuna: '',
      ciudad: '',
      tipoDeServicioId: undefined,
    },
  });

  useEffect(() => {
    const loadTiposDeServicio = async () => {
      try {
        const response = await tiposDeServicioService.getTiposDeServicio();
        if (response && response.tiposDeServicio) {
          setTiposDeServicio(response.tiposDeServicio);
        } else {
          console.error('Respuesta inválida al cargar tipos de servicio:', response);
          toast.error('Error al cargar los tipos de servicio');
        }
      } catch (error) {
        console.error('Error loading tipos de servicio:', error);
        toast.error(error instanceof Error ? error.message : 'Error al cargar los tipos de servicio');
      }
    };

    loadTiposDeServicio();
  }, []);

  const onSubmit = async (data: CreateClienteForm) => {
    try {
      setIsLoading(true);
      await clientesService.create(data);
      toast.success('Cliente creado correctamente');
      router.push('/dashboard/clientes');
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear el cliente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Cliente</CardTitle>
        <CardDescription>
          Ingresa los datos del nuevo cliente
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
                    <Input {...field} placeholder="Nombre completo del cliente" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RUT</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="XX.XXX.XXX-X" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" placeholder="+56 9 XXXX XXXX" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (opcional)</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="correo@ejemplo.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Calle y número" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comuna"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comuna</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Comuna" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ciudad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad/Población</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ciudad o población" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipoDeServicioId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Servicio</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo de servicio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposDeServicio.map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.id.toString()}>
                          {tipo.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/clientes')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creando...' : 'Crear Cliente'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 
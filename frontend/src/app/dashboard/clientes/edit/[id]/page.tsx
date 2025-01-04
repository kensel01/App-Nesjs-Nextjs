'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { clientesService } from '@/services/clientes.service';
import { tiposDeServicioService } from '@/services/tipos-de-servicio.service';
import { Cliente, TipoDeServicio } from '@/types/cliente.types';
import DashboardLayout from '@/components/layout/DashboardLayout';
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

type UpdateClienteForm = z.infer<typeof clienteFormSchema>;

export default function EditClientePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [tiposDeServicio, setTiposDeServicio] = useState<TipoDeServicio[]>([]);

  const form = useForm<UpdateClienteForm>({
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
    const fetchData = async () => {
      try {
        // Cargar tipos de servicio
        const tiposResponse = await tiposDeServicioService.getTiposDeServicio();
        if (tiposResponse && tiposResponse.tiposDeServicio) {
          setTiposDeServicio(tiposResponse.tiposDeServicio);
        }

        // Cargar datos del cliente
        const clienteData = await clientesService.getById(Number(params.id));
        setCliente(clienteData);
        
        // Establecer valores por defecto en el formulario
        form.reset({
          name: clienteData.name,
          rut: clienteData.rut,
          telefono: clienteData.telefono,
          email: clienteData.email || '',
          direccion: clienteData.direccion,
          comuna: clienteData.comuna,
          ciudad: clienteData.ciudad,
          tipoDeServicioId: clienteData.tipoDeServicio?.id,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error al cargar los datos');
        router.push('/dashboard/clientes');
      }
    };

    fetchData();
  }, [params.id, form, router]);

  const onSubmit = async (data: UpdateClienteForm) => {
    try {
      setIsLoading(true);
      await clientesService.update(Number(params.id), data);
      toast.success('Cliente actualizado correctamente');
      router.push('/dashboard/clientes');
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error(error instanceof Error ? error.message : 'Error al actualizar el cliente');
    } finally {
      setIsLoading(false);
    }
  };

  if (!cliente) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle>Editar Cliente</CardTitle>
          <CardDescription>
            Modifica los datos del cliente seleccionado
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
                      <Input {...field} />
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
                      <Input {...field} />
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
                      <Input {...field} type="tel" />
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
                      <Input {...field} type="email" />
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
                      <Input {...field} />
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
                      <Input {...field} />
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
                      <Input {...field} />
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
                  {isLoading ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
} 
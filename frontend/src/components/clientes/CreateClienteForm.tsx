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
  const [isLoadingTipos, setIsLoadingTipos] = useState(true);

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
        setIsLoadingTipos(true);
        const response = await tiposDeServicioService.getTiposDeServicio();
        if (response && response.tiposDeServicio && response.tiposDeServicio.length > 0) {
          setTiposDeServicio(response.tiposDeServicio);
        } else {
          console.error('Respuesta inválida al cargar tipos de servicio:', response);
          toast.error('No se encontraron tipos de servicio disponibles');
        }
      } catch (error) {
        console.error('Error loading tipos de servicio:', error);
        toast.error(error instanceof Error ? error.message : 'Error al cargar los tipos de servicio');
      } finally {
        setIsLoadingTipos(false);
      }
    };

    loadTiposDeServicio();
  }, []);

  const onSubmit = async (data: CreateClienteForm) => {
    try {
      setIsLoading(true);
      
      // Validación adicional para asegurar que tipoDeServicioId no sea undefined
      if (!data.tipoDeServicioId) {
        toast.error('Debes seleccionar un tipo de servicio');
        return;
      }
      
      await clientesService.create(data);
      toast.success('Cliente creado correctamente');
      router.push('/dashboard/clientes');
    } catch (error) {
      console.error('Error creating client:', error);
      
      // Mostrar mensaje más descriptivo del error
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          toast.error('No tienes permisos para crear clientes. Verifica tu sesión.');
        } else {
          toast.error(`Error: ${error.message}`);
        }
      } else {
        toast.error('Error al crear el cliente');
      }
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
                  {isLoadingTipos ? (
                    <div className="text-sm text-muted-foreground">Cargando tipos de servicio...</div>
                  ) : (
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString() || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo de servicio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposDeServicio.length > 0 ? (
                          tiposDeServicio.map((tipo) => (
                            <SelectItem key={tipo.id} value={tipo.id.toString()}>
                              {tipo.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-options" disabled>
                            No hay tipos de servicio disponibles
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
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
              <Button type="submit" disabled={isLoading || isLoadingTipos}>
                {isLoading ? 'Creando...' : 'Crear Cliente'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 
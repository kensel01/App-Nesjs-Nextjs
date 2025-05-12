'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { PagePermissionGuard } from '@/components/auth/PagePermissionGuard';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Role } from '@/types/user.types';
import { useMutation } from '@tanstack/react-query';
import { usuariosService } from '@/services/users.service';
import { CreateUserDTO } from '@/types/user.types';

const createUserSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Ingrese un correo electrónico válido'),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: 'Seleccione un rol válido' }) 
  }),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type CreateUserForm = z.infer<typeof createUserSchema>;

function getRoleLabel(role: Role): string {
  switch (role) {
    case Role.ADMIN: return 'Administrador';
    case Role.TECNICO: return 'Técnico';
    case Role.USER: return 'Usuario';
    default: return role;
  }
}

export default function CreateUserPage() {
  const router = useRouter();
  const { toast } = useToast();

  const createMutation = useMutation(
    (newUserData: CreateUserDTO) => usuariosService.create(newUserData),
    {
      onSuccess: (data) => {
        toast({
          title: 'Usuario creado',
          description: `El usuario ${data.name} ha sido creado exitosamente.`,
          variant: 'success',
        });
        router.push('/dashboard/users');
      },
      onError: (error: any) => {
        console.error('Error al crear usuario:', error);
        toast({
          title: 'Error',
          description: error?.message || 'No se pudo crear el usuario. Inténtelo de nuevo.',
          variant: 'destructive',
        });
      },
    }
  );

  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: Role.USER,
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: CreateUserForm) => {
    createMutation.mutate({
      name: data.name,
      email: data.email,
      role: data.role,
      password: data.password,
    });
  };

  return (
    <PagePermissionGuard allowedRoles={[Role.ADMIN]}>
      <div className="container max-w-2xl py-10">
        <div className="mb-6">
          <Link
            href="/dashboard/users"
            className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver a la lista de usuarios
          </Link>
          <h1 className="text-2xl font-bold">Crear Nuevo Usuario</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Usuario</CardTitle>
            <CardDescription>
              Introduce los datos del nuevo usuario. La contraseña debe tener al menos 8 caracteres.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre completo" {...field} />
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
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="usuario@ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rol</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar rol" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(Role).map((roleValue) => (
                            <SelectItem key={roleValue} value={roleValue}>
                              {getRoleLabel(roleValue)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Define los permisos del usuario en el sistema.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription>
                        Mínimo 8 caracteres. El usuario podrá cambiarla después.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard/users')}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createMutation.isLoading}>
                    {createMutation.isLoading ? 'Creando...' : 'Crear Usuario'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PagePermissionGuard>
  );
} 
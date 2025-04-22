'use client';

import { Suspense } from 'react';
import { z } from 'zod';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const { useState } = require('react');
  const { useForm } = require('react-hook-form');
  const { zodResolver } = require('@hookform/resolvers/zod');
  const Link = require('next/link').default;
  const { useRouter, useSearchParams } = require('next/navigation');
  const { ArrowLeft } = require('lucide-react');
  const { useToast } = require('@/components/ui/use-toast');

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: { password: string; confirmPassword: string }) => {
    try {
      if (!token) {
        toast({
          title: 'Error',
          description: 'Token de restablecimiento no válido o expirado',
          variant: 'destructive',
        });
        return;
      }

      setIsSubmitting(true);

      // En un entorno real, esta sería la llamada al API
      // const response = await fetch('/api/v1/auth/reset-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     token,
      //     password: data.password,
      //   }),
      // });

      // Simulamos la respuesta del servidor
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsSuccess(true);
      toast({
        title: 'Contraseña actualizada',
        description: 'Su contraseña ha sido actualizada exitosamente.',
        variant: 'success',
      });

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      toast({
        title: 'Error',
        description: 'No se pudo restablecer su contraseña. Inténtelo de nuevo más tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si no hay token, mostrar mensaje de error
  if (!token && !isSuccess) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Enlace no válido</CardTitle>
            <CardDescription>
              El enlace de restablecimiento de contraseña no es válido o ha expirado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/forgot-password">Solicitar nuevo enlace</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/auth/login"
        className="flex items-center text-sm text-muted-foreground hover:text-primary absolute top-8 left-8"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Volver al inicio de sesión
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Restablecer contraseña</CardTitle>
          <CardDescription>
            Cree una nueva contraseña segura para su cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                Su contraseña ha sido actualizada exitosamente.
                Será redirigido al inicio de sesión en unos momentos.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/login">Ir al inicio de sesión</Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva contraseña</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="********" 
                          type="password" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        La contraseña debe tener al menos 8 caracteres e incluir una letra minúscula, 
                        una letra mayúscula y un número.
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
                        <Input 
                          placeholder="********" 
                          type="password" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Actualizando...' : 'Actualizar contraseña'}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Cargando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
} 
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Ingrese un correo electrónico válido'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setIsSubmitting(true);

      // En un entorno real, esta sería la llamada al API
      // const response = await fetch('/api/v1/auth/forgot-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     email: data.email,
      //   }),
      // });

      // Simulamos la respuesta del servidor
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsSuccess(true);
      toast({
        title: 'Correo enviado',
        description: 'Se ha enviado un enlace de recuperación a su correo electrónico.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error al enviar correo de recuperación:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar el correo de recuperación. Inténtelo de nuevo más tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <CardTitle className="text-2xl font-bold">Recuperar contraseña</CardTitle>
          <CardDescription>
            Ingrese su correo electrónico para recibir instrucciones de recuperación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                Hemos enviado un correo electrónico a <span className="font-medium">{form.getValues().email}</span> con 
                instrucciones para restablecer su contraseña.
              </p>
              <p className="text-sm text-muted-foreground">
                Si no recibe el correo en unos minutos, verifique su carpeta de spam o
                inténtelo de nuevo.
              </p>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/auth/login">Volver al inicio de sesión</Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="ejemplo@correo.com" 
                          type="email" 
                          {...field} 
                          autoComplete="email"
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
                  {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
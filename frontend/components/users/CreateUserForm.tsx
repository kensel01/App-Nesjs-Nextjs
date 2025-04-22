'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Role } from '@/types/user.types';
import { userFormSchema } from '@/lib/validations/user';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import type { z } from 'zod';

type FormData = z.infer<typeof userFormSchema>;

export default function CreateUserForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: Role.USER,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const { confirmPassword, ...userData } = data;
      await authService.register(userData);
      toast.success('Usuario creado correctamente');
      router.push('/dashboard/users');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const password = form.watch('password');
  const passwordStrength = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  };

  const passwordStrengthScore = Object.values(passwordStrength).filter(Boolean).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Nuevo Usuario</CardTitle>
        <CardDescription>
          Ingresa los datos del nuevo usuario. Todos los campos son obligatorios.
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
                    <Input {...field} placeholder="Juan Pérez" autoComplete="name" />
                  </FormControl>
                  <FormDescription>
                    Ingresa el nombre completo del usuario
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="usuario@ejemplo.com" autoComplete="email" />
                  </FormControl>
                  <FormDescription>
                    Este será el correo electrónico para iniciar sesión
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
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <div className="mt-2 space-y-2">
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrengthScore === 0
                            ? 'w-0'
                            : passwordStrengthScore === 1
                            ? 'w-1/5 bg-red-500'
                            : passwordStrengthScore === 2
                            ? 'w-2/5 bg-orange-500'
                            : passwordStrengthScore === 3
                            ? 'w-3/5 bg-yellow-500'
                            : passwordStrengthScore === 4
                            ? 'w-4/5 bg-lime-500'
                            : 'w-full bg-green-500'
                        }`}
                      />
                    </div>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        {passwordStrength.minLength ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <span className={passwordStrength.minLength ? 'text-green-700' : 'text-gray-500'}>
                          Mínimo 8 caracteres
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        {passwordStrength.hasUppercase ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <span className={passwordStrength.hasUppercase ? 'text-green-700' : 'text-gray-500'}>
                          Una letra mayúscula
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        {passwordStrength.hasLowercase ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <span className={passwordStrength.hasLowercase ? 'text-green-700' : 'text-gray-500'}>
                          Una letra minúscula
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        {passwordStrength.hasNumber ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <span className={passwordStrength.hasNumber ? 'text-green-700' : 'text-gray-500'}>
                          Un número
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        {passwordStrength.hasSpecialChar ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <span className={passwordStrength.hasSpecialChar ? 'text-green-700' : 'text-gray-500'}>
                          Un carácter especial
                        </span>
                      </li>
                    </ul>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Contraseña</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
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
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Role.ADMIN}>Administrador</SelectItem>
                      <SelectItem value={Role.USER}>Usuario</SelectItem>
                      <SelectItem value={Role.TECNICO}>Técnico</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    El rol determina los permisos del usuario en el sistema
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/users')}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || passwordStrengthScore < 5}>
                {isLoading ? 'Creando usuario...' : 'Crear Usuario'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 
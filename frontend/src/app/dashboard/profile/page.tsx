'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { usersService } from '@/services/users.service';
import { useRouter } from 'next/navigation';
import { UpdateUserDTO } from '@/types/user.types';
import { PagePermissionGuard } from '@/components/auth/PagePermissionGuard';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  
  const [name, setName] = useState(session?.user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password && password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Las contraseñas no coinciden',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const updateData: UpdateUserDTO = { 
        name,
      };
      
      if (password) {
        updateData.password = password;
      }
      
      const result = await usersService.updateProfile(updateData);
      
      toast({
        title: '¡Éxito!',
        description: 'Perfil actualizado correctamente',
      });
      
      // Actualizar la sesión con el nuevo nombre
      if (session) {
        await update({
          ...session,
          user: {
            ...session.user,
            name: result.user.name,
          },
        });
      }
      
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al actualizar el perfil',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <PagePermissionGuard resource="profile" action="update">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Mi Perfil</CardTitle>
            <CardDescription>
              Actualiza tu información personal
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  value={session?.user?.email || ''}
                  disabled
                  className="bg-gray-100"
                />
                <p className="text-sm text-gray-500">El correo electrónico no se puede cambiar</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Input
                  id="role"
                  value={session?.user?.role || ''}
                  disabled
                  className="bg-gray-100"
                />
                <p className="text-sm text-gray-500">El rol solo puede ser modificado por un administrador</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Nueva contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Dejar en blanco para mantener la actual"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirma tu nueva contraseña"
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard')}
                type="button"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PagePermissionGuard>
  );
} 
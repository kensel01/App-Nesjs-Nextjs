'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Edit, User, Mail, Calendar, Shield, Timer, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PagePermissionGuard } from '@/components/auth/PagePermissionGuard';
import { useToast } from '@/components/ui/use-toast';
import { Role } from '@/types/user.types';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
};

interface UserDetailPageProps {
  params: {
    id: string;
  };
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // En un entorno real, esta sería la llamada al API
        // const response = await fetch(`/api/v1/users/${params.id}`);
        // const data = await response.json();

        // Simulamos datos del usuario
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Datos de ejemplo según el ID
        const mockUser: User = {
          id: params.id,
          name: params.id === '1' ? 'Admin Principal' : 
                params.id === '2' ? 'Juan Pérez' : 
                params.id === '3' ? 'María López' : 
                params.id === '4' ? 'Carlos Gómez' : 
                params.id === '5' ? 'Ana Martínez' : 'Usuario',
          email: params.id === '1' ? 'admin@example.com' : 
                 params.id === '2' ? 'juan@example.com' : 
                 params.id === '3' ? 'maria@example.com' : 
                 params.id === '4' ? 'carlos@example.com' : 
                 params.id === '5' ? 'ana@example.com' : 'usuario@example.com',
          role: params.id === '1' || params.id === '4' ? 'admin' : 'user',
          status: params.id === '4' ? 'inactive' : 'active',
          createdAt: params.id === '1' ? '2023-01-15T08:30:00.000Z' : 
                     params.id === '2' ? '2023-02-20T10:15:00.000Z' : 
                     params.id === '3' ? '2023-03-05T14:20:00.000Z' : 
                     params.id === '4' ? '2023-01-10T09:45:00.000Z' : 
                     params.id === '5' ? '2023-04-12T11:30:00.000Z' : new Date().toISOString(),
          updatedAt: params.id === '1' ? '2023-05-10T15:45:00.000Z' : 
                     params.id === '2' ? '2023-06-05T09:20:00.000Z' : 
                     params.id === '3' ? '2023-04-18T11:10:00.000Z' : 
                     params.id === '4' ? '2023-02-28T16:30:00.000Z' : 
                     params.id === '5' ? '2023-05-22T13:40:00.000Z' : new Date().toISOString(),
          lastLogin: params.id === '4' ? undefined : 
                     params.id === '1' ? '2023-08-15T08:30:00.000Z' : 
                     params.id === '2' ? '2023-08-10T10:15:00.000Z' : 
                     params.id === '3' ? '2023-08-12T14:20:00.000Z' : 
                     params.id === '5' ? '2023-08-14T11:30:00.000Z' : new Date().toISOString(),
        };

        setUser(mockUser);
      } catch (error) {
        console.error('Error al cargar detalles del usuario:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los detalles del usuario',
          variant: 'destructive',
        });
        router.push('/dashboard/users');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id, router, toast]);

  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    
    const date = new Date(dateString);
    return format(date, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
  };

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h2 className="text-lg font-medium">Usuario no encontrado</h2>
          <p className="text-sm text-muted-foreground mt-1">
            El usuario que busca no existe o ha sido eliminado.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/users">Volver a la lista de usuarios</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PagePermissionGuard allowedRoles={[Role.ADMIN]}>
      <div className="container py-10">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-muted-foreground hover:text-primary mb-4"
            asChild
          >
            <Link href="/dashboard/users">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Volver a la lista de usuarios
            </Link>
          </Button>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Detalle de Usuario</h1>
            {session?.user?.role === 'admin' && (
              <Button asChild>
                <Link href={`/dashboard/users/${user.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Información del Usuario</CardTitle>
              <CardDescription>
                Detalles completos del perfil de usuario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="w-full sm:w-1/2">
                    <div className="flex items-center mb-2">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Nombre</span>
                    </div>
                    <p className="text-base">{user.name}</p>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <div className="flex items-center mb-2">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Correo electrónico</span>
                    </div>
                    <p className="text-base">{user.email}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="w-full sm:w-1/2">
                    <div className="flex items-center mb-2">
                      <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Rol</span>
                    </div>
                    <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                      {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </Badge>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <div className="flex items-center mb-2">
                      {user.status === 'active' ? (
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2 text-red-500" />
                      )}
                      <span className="text-sm font-medium">Estado</span>
                    </div>
                    <Badge variant={user.status === 'active' ? 'default' : 'outline'}>
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="w-full sm:w-1/2">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Fecha de creación</span>
                    </div>
                    <p className="text-sm">{formatDate(user.createdAt)}</p>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Última actualización</span>
                    </div>
                    <p className="text-sm">{formatDate(user.updatedAt)}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center mb-2">
                    <Timer className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Último inicio de sesión</span>
                  </div>
                  <p className="text-sm">{formatDate(user.lastLogin)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {session?.user?.role === 'admin' && (
                    <>
                      <Button className="w-full" asChild>
                        <Link href={`/dashboard/users/${user.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" /> Editar usuario
                        </Link>
                      </Button>
                      {user.status === 'active' ? (
                        <Button variant="outline" className="w-full">
                          <XCircle className="mr-2 h-4 w-4" /> Desactivar cuenta
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full">
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Activar cuenta
                        </Button>
                      )}
                      <Button variant="outline" className="w-full">
                        <Mail className="mr-2 h-4 w-4" /> Enviar correo
                      </Button>
                    </>
                  )}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/dashboard/users`}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Volver a la lista
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PagePermissionGuard>
  );
} 
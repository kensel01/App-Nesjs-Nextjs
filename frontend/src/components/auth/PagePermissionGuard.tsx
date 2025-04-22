'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Role } from '@/types/user.types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface PagePermissionGuardProps {
  children: ReactNode;
  allowedRoles: Role[];
  fallback?: ReactNode;
}

export function PagePermissionGuard({
  children,
  allowedRoles,
  fallback,
}: PagePermissionGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    // Verificar si el rol del usuario está en la lista de roles permitidos
    const userRole = session?.user?.role as Role;
    const isAllowed = userRole && allowedRoles.includes(userRole);
    
    setHasPermission(isAllowed);
  }, [session, status, allowedRoles, router]);

  // Mientras se verifica la sesión o los permisos
  if (status === 'loading' || hasPermission === null) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  // Si no tiene permisos, mostrar mensaje o redireccionar
  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="container py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Acceso denegado
            </CardTitle>
            <CardDescription>
              No tiene permisos para acceder a esta página.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Esta página requiere permisos especiales. 
              Si considera que debería tener acceso, contacte con el administrador.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/dashboard')} variant="outline" className="w-full">
              Volver al dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Si tiene permisos, mostrar el contenido
  return <>{children}</>;
} 
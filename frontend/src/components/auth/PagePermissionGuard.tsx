'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';

interface PagePermissionGuardProps {
  resource: 'users' | 'clients' | 'service-types';
  action: 'create' | 'read' | 'update' | 'delete';
  children: React.ReactNode;
}

export function PagePermissionGuard({
  resource,
  action,
  children,
}: PagePermissionGuardProps) {
  const router = useRouter();
  const { hasPermission } = usePermissions();

  useEffect(() => {
    if (!hasPermission(resource, action)) {
      router.push('/dashboard');
    }
  }, [resource, action, hasPermission, router]);

  if (!hasPermission(resource, action)) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500">
          No tienes permisos para ver esta página
        </p>
      </div>
    );
  }

  return <>{children}</>;
} 
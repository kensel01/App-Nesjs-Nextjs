'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';
import type { Resource, Action } from '@/types/permission.types';

interface PagePermissionGuardProps {
  resource: Resource;
  action: Action;
  children: React.ReactNode;
}

export function PagePermissionGuard({
  resource,
  action,
  children,
}: PagePermissionGuardProps) {
  const router = useRouter();
  const { check } = usePermissions();

  useEffect(() => {
    if (!check(resource, action)) {
      router.push('/dashboard');
    }
  }, [resource, action, check, router]);

  if (!check(resource, action)) {
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
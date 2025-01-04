'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionCheck } from '@/types/permission.types';

interface PermissionGuardProps {
  children: React.ReactNode;
  checks: PermissionCheck[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function PermissionGuard({
  children,
  checks,
  requireAll = true,
  fallback,
  redirectTo = '/dashboard',
}: PermissionGuardProps) {
  const router = useRouter();
  const { checkMany, checkAny } = usePermissions();

  const hasPermission = requireAll ? checkMany(checks) : checkAny(checks);

  useEffect(() => {
    if (!hasPermission && redirectTo) {
      router.push(redirectTo);
    }
  }, [hasPermission, redirectTo, router]);

  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return null;
  }

  return <>{children}</>;
} 
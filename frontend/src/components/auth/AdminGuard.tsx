'use client';

import { usePermissions } from '@/hooks/usePermissions';
import { Role } from '@/types/user.types';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { userRole } = usePermissions();

  if (userRole !== Role.ADMIN) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return null;
  }

  return <>{children}</>;
} 
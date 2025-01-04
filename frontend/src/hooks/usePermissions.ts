'use client';

import { useSession } from 'next-auth/react';
import { PERMISSIONS } from '@/types/permission.types';
import type { Resource, Action, PermissionCheck } from '@/types/permission.types';

export function usePermissions() {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const check = (resource: Resource, action: Action): boolean => {
    if (!userRole) return false;

    const permission = PERMISSIONS.find(
      (p) => p.resource === resource && p.action === action
    );

    return permission ? permission.roles.includes(userRole) : false;
  };

  const checkMany = (checks: PermissionCheck[]): boolean => {
    return checks.every((c) => check(c.resource, c.action));
  };

  const checkAny = (checks: PermissionCheck[]): boolean => {
    return checks.some((c) => check(c.resource, c.action));
  };

  return {
    check,
    checkMany,
    checkAny,
    userRole,
  };
} 
'use client';

import { useSession } from 'next-auth/react';

type Resource = 'users' | 'clients' | 'service-types';
type Action = 'create' | 'read' | 'update' | 'delete';

export function usePermissions() {
  const { data: session } = useSession();

  const hasPermission = (resource: Resource, action: Action): boolean => {
    if (!session?.user) return false;

    const { role } = session.user;

    // Por ahora, el admin tiene todos los permisos
    if (role === 'admin') return true;

    // Aquí podemos definir los permisos específicos para cada rol
    const permissions: Record<string, Record<Resource, Action[]>> = {
      user: {
        users: ['read'],
        clients: ['read', 'create', 'update'],
        'service-types': ['read'],
      },
    };

    return permissions[role]?.[resource]?.includes(action) ?? false;
  };

  return {
    hasPermission,
  };
} 
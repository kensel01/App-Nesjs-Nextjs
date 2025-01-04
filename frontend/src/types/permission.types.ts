import { Role } from './user.types';

export type Resource = 'users' | 'clients' | 'service-types';
export type Action = 'create' | 'read' | 'update' | 'delete';

export interface Permission {
  resource: Resource;
  action: Action;
  roles: Role[];
}

export interface PermissionCheck {
  resource: Resource;
  action: Action;
}

export type PermissionMap = Record<string, boolean>;

export const PERMISSIONS: Permission[] = [
  // Usuarios
  { resource: 'users', action: 'create', roles: ['admin'] },
  { resource: 'users', action: 'read', roles: ['admin'] },
  { resource: 'users', action: 'update', roles: ['admin'] },
  { resource: 'users', action: 'delete', roles: ['admin'] },

  // Clientes
  { resource: 'clients', action: 'create', roles: ['admin', 'user'] },
  { resource: 'clients', action: 'read', roles: ['admin', 'user'] },
  { resource: 'clients', action: 'update', roles: ['admin', 'user'] },
  { resource: 'clients', action: 'delete', roles: ['admin'] },

  // Tipos de servicio
  { resource: 'service-types', action: 'create', roles: ['admin'] },
  { resource: 'service-types', action: 'read', roles: ['admin', 'user'] },
  { resource: 'service-types', action: 'update', roles: ['admin'] },
  { resource: 'service-types', action: 'delete', roles: ['admin'] },
]; 
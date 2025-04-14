import { Role } from './user.types';

export type Resource = 'users' | 'clients' | 'service-types' | 'dashboard' | 'profile';
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
  // Dashboard
  { resource: 'dashboard', action: 'read', roles: [Role.ADMIN, Role.USER, Role.TECNICO] },

  // Usuarios
  { resource: 'users', action: 'create', roles: [Role.ADMIN] },
  { resource: 'users', action: 'read', roles: [Role.ADMIN] },
  { resource: 'users', action: 'update', roles: [Role.ADMIN] },
  { resource: 'users', action: 'delete', roles: [Role.ADMIN] },

  // Clientes
  { resource: 'clients', action: 'create', roles: [Role.ADMIN, Role.USER, Role.TECNICO] },
  { resource: 'clients', action: 'read', roles: [Role.ADMIN, Role.USER, Role.TECNICO] },
  { resource: 'clients', action: 'update', roles: [Role.ADMIN, Role.USER] },
  { resource: 'clients', action: 'delete', roles: [Role.ADMIN] },

  // Tipos de servicio
  { resource: 'service-types', action: 'create', roles: [Role.ADMIN] },
  { resource: 'service-types', action: 'read', roles: [Role.ADMIN, Role.USER, Role.TECNICO] },
  { resource: 'service-types', action: 'update', roles: [Role.ADMIN] },
  { resource: 'service-types', action: 'delete', roles: [Role.ADMIN] },
  
  // Perfil personal
  { resource: 'profile', action: 'read', roles: [Role.ADMIN, Role.USER, Role.TECNICO] },
  { resource: 'profile', action: 'update', roles: [Role.ADMIN, Role.USER, Role.TECNICO] },
]; 
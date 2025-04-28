import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../common/enums/rol.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay roles requeridos, permitir acceso
    if (!requiredRole || requiredRole.length === 0) {
      this.logger.debug('No required role, access granted');
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Verificar si el usuario existe y tiene un rol
    if (!user || !user.role) {
      this.logger.warn('Access denied: No user or role in request', { 
        user: user ? 'exists' : 'undefined',
        userRole: user?.role || 'no role'
      });
      return false;
    }

    // Los administradores tienen acceso a todo
    if (user.role === Role.ADMIN) {
      this.logger.debug('Admin access granted');
      return true;
    }

    // Verificar si el rol del usuario está en los roles permitidos
    const hasRole = requiredRole.some(role => role === user.role);
    
    this.logger.debug(
      hasRole ? 'Role access granted' : 'Access denied: role not authorized', 
      { userRole: user.role, requiredRoles: requiredRole }
    );
    
    return hasRole;
  }
}

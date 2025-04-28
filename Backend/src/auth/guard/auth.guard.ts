import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { jwtConstans } from '../constants/jwt.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      this.logger.warn('No token provided in request');
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      this.logger.debug('Verifying JWT token');
      const payload = await this.jwtService.verifyAsync(token);
      
      // Verificar que el payload tenga los datos requeridos
      if (!payload || !payload.email || !payload.role) {
        this.logger.warn('Invalid token payload', { 
          hasPayload: !!payload,
          hasEmail: payload?.email ? true : false,
          hasRole: payload?.role ? true : false
        });
        throw new UnauthorizedException('Token inválido');
      }
      
      this.logger.debug('Token verification successful', { 
        email: payload.email,
        role: payload.role
      });
      
      // Guardar los datos del usuario en el objeto request
      request.user = {
        email: payload.email,
        role: payload.role
      };
    } catch (error) {
      this.logger.error('Token verification failed', error);
      throw new UnauthorizedException('Token no válido o expirado');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      this.logger.debug('No authorization header found');
      return undefined;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      this.logger.debug('Invalid authorization header format', { header: authHeader });
      return undefined;
    }
    
    return parts[1];
  }
}

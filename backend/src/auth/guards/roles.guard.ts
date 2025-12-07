import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>(
      ROLE_KEY,
      context.getHandler(),
    );

    // Si aucune restriction → accès autorisé
    if (!requiredRole) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Injecté par JwtStrategy

    if (!user) {
      throw new ForbiddenException('Utilisateur non authentifié');
    }

    if (user.role !== requiredRole) {
      throw new ForbiddenException('Accès interdit : rôle insuffisant');
    }

    return true;
  }
}

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Récupération des rôles requis depuis les métadonnées
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // S'il n'y a pas de rôle requis, on autorise l'accès
    if (!requiredRoles) {
      return true;
    }

    // Récupération de l'utilisateur depuis la requête
    const { user } = context.switchToHttp().getRequest();
    
    // Vérification du rôle de l'utilisateur
    return requiredRoles.includes(user.role);
  }
}
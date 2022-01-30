import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthRole, ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AuthRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('requiredRoles', requiredRoles);
    
    if (!requiredRoles) {
      return true;
    }
    const { headers } = context.switchToHttp().getRequest();
    let { authorization } = headers;
    authorization = authorization.slice(7);
    const decoded = this.jwtService.decode(authorization);
    return requiredRoles.some((role) => decoded['role'].includes(role));
  }
}
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from './roles';
import { ROLES_KEY } from './roles.decorators';

type JwtUserPayload = {
  userId: string;
  email: string;
  role: UserRole;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user: JwtUserPayload }>();
    const user = request.user;
    if (!user || !user.role) {
      return false;
    }

    return requiredRoles.includes(user.role);
  }
}

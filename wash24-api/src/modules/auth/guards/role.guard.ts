import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';


@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get roles from handler first (method-level), then fall back to class (controller-level)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user?.roles) {
      throw new ForbiddenException(`Invalid user roles. Required roles: ${requiredRoles.join(', ')}`);
    }

    // Check if user has any of the required roles
    const hasRole = user.roles.some((role) => 
      requiredRoles.includes(role)
    );

    if (!hasRole) {
      throw new ForbiddenException(
        `Required roles: ${requiredRoles.join(', ')}`
      );
    }

    return true;
  }

   private extractToken(request: Request): string | null {
      const authHeader = request.headers.authorization;
      return authHeader?.split(' ')[1] || null;
    }


}
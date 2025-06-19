 import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../services/token.service';
import { Request } from 'express';

@Injectable()
export class SignoutGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Access token is required');
    }

    try {
      // Verify token without checking expiration
      const payload = this.jwtService.verify(token, { ignoreExpiration: true });
      
      if (!payload?.jti) {
        throw new UnauthorizedException('Invalid access token');
      }

      // Check token status in DB
      const tokenRecord = await this.tokenService.findTokenByJti(payload.jti);
      if (!tokenRecord) {
        throw new UnauthorizedException('Invalid access token');
      }

      // Attach payload to request
      request.payload = {
        userId: payload.userId,
        roles: payload.roles,
        jti: payload.jti,
        token: token
      };
      
      return true;
      
    } catch (error: any) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid access token');
      }
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization;
    return authHeader?.split(' ')[1] || null;
  }
}
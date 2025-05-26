import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../services/token.service';
import { Request } from 'express';

@Injectable()
export default class AuthGuard implements CanActivate {
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
      // 1️⃣ Verify JWT
      const payload = this.jwtService.verify(token);
      if (!payload?.jti) {
        throw new UnauthorizedException('Invalid access token');
      }

      // 2️⃣ Check token status in DB
      const tokenRecord = await this.tokenService.findTokenByJti(payload.jti);
      if (!tokenRecord) {
        throw new UnauthorizedException('Invalid access token');
      }

      if (tokenRecord.isRevoked) {
        throw new UnauthorizedException('Invalid access token');
      }

      // 3️⃣ Attach user to request
      request.user = payload;
      return true;
      
    } catch (error: any) {
      
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid access token');
      }
      // Re-throw existing UnauthorizedException
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // Default case
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization;
    return authHeader?.split(' ')[1] || null;
  }
}
import { Request, Response } from 'express';
import { Controller, Post, Get, Param, Req, Res, UseGuards, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../services/auth.service';
import AuthGuard from '../guards/jwt.auth-guard';
import { OtpService } from '../services/otp.service';
import { TokenService } from '../services/token.service';

@Controller('/api/auth')
class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService,
  ) {}

  private extractToken(request: Request): string | null {
    // Explicitly type headers as an indexable object
    const headers = request.headers as unknown as { [key: string]: string };
    const authHeader = headers['authorization'];
    return authHeader?.split(' ')[1] || null;
  
  }

  private extractTokenFromCookies(request: Request): string | null {
    return request.cookies?.access_token || null;
  }

  @Post('signup')
  async signup(@Req() req: Request, @Res() res: Response): Promise<void> {
    res.send({ message: 'User was registered successfully!' });
    return;
  }

  @Post('forget_password_request')
  async forgetPasswordRequest(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const token = await this.authService.requestToChangePassword(req.body)
      this.setResetPasswordCookies(res, token);
      res.status(200).json({ message: 'Change request is successfully' }); 
      return;
    } catch (err) {
      if (err instanceof BadRequestException) {
        res.status(400).send(err.getResponse());
        return;
      }
      this.clearResetPasswordCookies(res);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
  }

  @Post('otp_verify')
  @UseGuards(AuthGuard)
  async otpVerify(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const token:any = await this.authService.validateOtp(req.body);
      const payload = (req as any).payload;
      if (payload) {
          await this.tokenService.revokeToken(payload.jti);
      }
      res.status(200).json({ message: 'OTP validate successfully', token: token.accessToken }); 
    } catch (err) {
      if (err instanceof BadRequestException) {
        res.status(400).send(err.getResponse());
        return;
      }
      res.status(500).json({ error: 'Error verifying token' });
      return;
    }    
  }

  @Post('update_user_password')
  @UseGuards(AuthGuard)
  async changePassword(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      await this.authService.changePassword(req.body);
      const payload = (req as any).payload;
      if (payload) {
          await this.tokenService.revokeToken(payload.jti);
      }
      res.status(200).json({ message: 'User password is changed successfully.'}); 
      return;
    } catch (err) {
      if (err instanceof BadRequestException) {
        res.status(400).send(err.getResponse());
        return;
      }
      res.status(500).json({ error: 'Error change user password.' });
      return;
    }    
  }

  @Get('signout')
  @UseGuards(AuthGuard)
  public async signout(@Req() req: Request, @Res() res: Response): Promise<void> {
      try {
          const token = this.extractTokenFromCookies(req);

          if (!token) {
              res.status(401).json({ message: 'Unauthorized: Token missing' });
              return;
          }
          await this.authService.signOut(token);
          res.clearCookie('access_token');
          res.clearCookie('refresh_token');
          res.clearCookie('user_id');

          res.status(200).json({ message: 'Successfully signed out' });
          return;
      } catch (error) {
          console.error('Signout error:', error);
          res.status(500).json({ message: 'Internal server error during signout' });
          return;
      }
  }

  @Post('refresh')
  public async refresh(@Req() req: Request, @Res() res: Response): Promise<void> {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) {
          res.status(401).json({ message: 'Unauthorized: Refresh token missing' });
          return;
      }
      try {
         const data =  { 
                      refreshToken: refreshToken,
                      systemType: req.body.system,
                      deviceType: req.body.deviceType,
                      deviceId: req.body.deviceId,
                      ipAddress: (typeof req.headers['x-forwarded-for'] === 'string'
                        ? req.headers['x-forwarded-for']
                        : Array.isArray(req.headers['x-forwarded-for'])
                          ? req.headers['x-forwarded-for'][0]
                          : req.socket.remoteAddress) || '',
                      userAgent: typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'] : ''};
        const token = await this.authService.refresh(data);
        res.status(200).send(token);
          return;

      } catch (error) {
          if (error instanceof BadRequestException) {
            res.status(400).send(error.getResponse());
            return;
          }
          
          res.status(500).send({ message: 'Internal Server Error' });
      }
  }

  @Post('signin')
  async signin(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ message: string }> {
    try {
      console.log('Received signin request:', req.body);
      
      const data = {
        username: req.body.username,
        password: req.body.password,
        systemType: req.body.system,
        deviceType: req.body.deviceType,
        deviceId: req.body.deviceId,
        ipAddress: (typeof req.headers['x-forwarded-for'] === 'string'
          ? req.headers['x-forwarded-for']
          : Array.isArray(req.headers['x-forwarded-for'])
            ? req.headers['x-forwarded-for'][0]
            : req.socket.remoteAddress) || '',
        userAgent: typeof req.headers['user-agent'] === 'string' 
          ? req.headers['user-agent'] 
          : ''
      };

      const token = await this.authService.signIn(data);
      this.setAuthCookies(res, token);
      return { message: 'Authentication successful' };

    } catch (error) {
      this.clearAuthCookies(res);
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Get('check')
  async checkAuth(@Req() req: Request) {
     const cookies = this.parseCookies(req.headers.cookie);
    return { 
      isAuthenticated: !!cookies.access_token,
      userId: cookies.user_id 
    };
  }

  private parseCookies(cookieHeader?: string): Record<string, string> {
    if (!cookieHeader) return {};
    
    return cookieHeader.split(';').reduce((cookies, cookie) => {
      const [name, value] = cookie.trim().split('=');
      cookies[name] = value;
      return cookies;
    }, {} as Record<string, string>);
  }

  private setResetPasswordCookies(res: Response, tokens: any) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: tokens.accessTokenExpires * 1000,
        path: '/'
    });
  }

  private clearResetPasswordCookies(res: Response) {
    res.clearCookie('access_token', { path: '/' });
  }

  private setAuthCookies(res: Response, tokens: any) {
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Access token
    res.cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: tokens.accessTokenExpires * 1000,
        path: '/'
    });

    // Refresh token
    res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: tokens.refreshTokenExpires * 1000,
        path: '/auth' // Should match your refresh endpoint path
    });

    // User ID
    res.cookie('user_id', tokens.userId, {
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: tokens.accessTokenExpires * 1000,
        path: '/'
    });
  }

    private clearAuthCookies(res: Response) {
        res.clearCookie('access_token', { path: '/' });
        res.clearCookie('refresh_token', { path: '/auth' });
        res.clearCookie('user_id', { path: '/' });
    }

}

export default AuthController;
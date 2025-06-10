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

  @Post('signup')
  async signup(@Req() req: Request, @Res() res: Response): Promise<void> {
    res.send({ message: 'User was registered successfully!' });
    return;
  }

  @Post('forget_password_request')
  async forgetPasswordRequest(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const token = await this.authService.requestToChangePassword(req.body)
      res.status(200).json({ message: 'Change request is successfully', token: token.accessToken }); 
      return;
    } catch (err) {
      if (err instanceof BadRequestException) {
        res.status(400).send(err.getResponse());
        return;
      }
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
  }

  @Post('validate_otp')
  @UseGuards(AuthGuard)
  async validateotp(@Req() req: Request, @Res() res: Response): Promise<void> {
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
          const token = this.extractToken(req);
          if (!token) {
              res.status(401).json({ message: 'Unauthorized: Token missing' });
              return;
          }
          await this.authService.signOut(token);
          res.clearCookie('accessToken');
          res.clearCookie('refreshToken');
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

    // Set secure HttpOnly cookies
    res.cookie('access_token', token.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: token.accessTokenExpires * 1000, // convert to milliseconds
      path: '/',
    });

    res.cookie('refresh_token', token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: token.refreshTokenExpires * 1000, // convert to milliseconds
      path: '/auth/refresh', // Only sent to refresh endpoint
    });

    // Optionally set non-sensitive data in cookies if needed
    res.cookie('user_id', token.userId, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: token.accessTokenExpires * 1000,
    });

    return { message: 'Authentication successful' };

  } catch (error) {
    console.error(error);
    
    // Clear cookies on error
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.clearCookie('user_id');

    if (error instanceof BadRequestException) {
      throw new BadRequestException(error.message);
    }
    throw new InternalServerErrorException('Internal Server Error');
  }
}

}

export default AuthController;
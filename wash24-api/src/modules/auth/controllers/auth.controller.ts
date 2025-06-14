import { Request, Response } from 'express';
import { Controller, Post, Get, Param, Req, Res, UseGuards, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../services/auth.service';
import AuthGuard from '../guards/jwt.auth-guard';
import { OtpService } from '../services/otp.service';
import { TokenService } from '../services/token.service';
import { UserService } from '../../identity/services/user.service';
import { TokenType } from '../enums/auth.enums';
import { ConfigService } from '@nestjs/config';

@Controller('/api/auth')
class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    
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
      const data = req.body;
      if (!req.body.username ) {
          throw new BadRequestException({
              error: 400,
              message: ' username are required.',
          });
      }
      const user = await this.userService.findByUsername(data.username.toLowerCase().trim());
      if (!user) {
          throw new BadRequestException({
              error: 404,
              message: 'Could not find account with this username.',
          });
      }
      const otp = await this.otpService.createOtp(data.username);
      const token = await this.tokenService.createOTPToken(
              user,
              data.systemType,
              data.deviceType,
              data.deviceId,
              data.ipAddress,
              data.userAgent,
              TokenType.FORGET_PASSWORD_REQUEST);

      this.setResetPasswordCookies(res, token);
      const isProduction = process.env.NODE_ENV === 'production';
      const responseData = { 
        message: 'Change request is successfully.',
        ...(!isProduction && { token: token.accessToken, otp: otp })
      };
      res.status(200).json(responseData); 
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

  @Post('resend_otp')
  @UseGuards(AuthGuard)
  async resendOtp(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const data = req.body;
      const payload = (req as any).payload;
      if (!payload.userId ) {
        throw new BadRequestException({
            error: 400,
            message: 'Identifier are required.'
        });
      }

      const user = await this.userService.get(payload.userId);
      if (!user) {
          throw new BadRequestException({
              error: 404,
              message: 'Could not find account with this username.',
        });
      }

      const otp = await this.otpService.createOtp(user.username);
      const token = await this.tokenService.createOTPToken(
              user,
              data.systemType,
              data.deviceType,
              data.deviceId,
              data.ipAddress,
              data.userAgent,
              TokenType.FORGET_PASSWORD_REQUEST);

      this.setResetPasswordCookies(res, token);
      const isProduction = process.env.NODE_ENV === 'production';
      const responseData = { 
        message: 'Change request is successfully.',
        ...(!isProduction && { token: token.accessToken, otp: otp })
      };
      res.status(200).json(responseData); 
      return;

    } catch (err) {
      if (err instanceof BadRequestException) {
        res.status(400).send(err.getResponse());
        return;
      }
      this.clearResetPasswordCookies(res);
      res.status(500).json({ error: 'Error verifying token' });
      return;
    }    

  }

  @Post('otp_verify')
  @UseGuards(AuthGuard)
  async otpVerify(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {

      const payload = (req as any).payload;

      if (!req.body.otp ) {
            throw new BadRequestException({
                error: 400,
                message: 'otp are required.',
            });
      }

      if (!payload.userId ) {
        throw new BadRequestException({
            error: 400,
            message: 'Identifier are required.'
        });
      }

      const user = await this.userService.get(payload.userId);
      if (!user) {
          throw new BadRequestException({
              error: 404,
              message: 'Could not find account with this username.',
        });
      }

      const isValidOtp = await this.otpService.isValidOtp(req.body.otp);

      if (!isValidOtp) {
        throw new BadRequestException({
              error: 404,
              message: 'Invalid otp validation data.',
          });
      }

      await this.tokenService.revokeToken(payload.jti);
      const token = await this.tokenService.createOTPToken(
            user,
            req.body.systemType,
            req.body.deviceType,
            req.body.deviceId,
            req.body.ipAddress,
            req.body.userAgent,
            TokenType.OTP_VALIDATION);
        this.setResetPasswordCookies(res, token);
      const isProduction = process.env.NODE_ENV === 'production';
      const data = { 
        message: 'OTP validate successfully',
        // Only include token in development mode
        ...(!isProduction && { token: token.accessToken })
      };
      res.status(200).json(data); 
      return;
    } catch (err) {
      if (err instanceof BadRequestException) {
        res.status(400).send(err.getResponse());
        return;
      }
      this.clearResetPasswordCookies(res);
      res.status(500).json({ error: 'Error verifying token' });
      return;
    }    
  }

  @Post('update_user_password')
  @UseGuards(AuthGuard)
  async changePassword(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      await this.authService.changePassword(req.body);
      const payload = (req as any).user;
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

    const accessTokenExpiresIn = this.parseDurationToMs(
        this.configService.get<string>('JWT_FORGET_PASSWORD_EXPIRES_IN', '1m')
    );

    res.cookie('token_type', 'RESET_TOKEN', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: accessTokenExpiresIn,
        path: '/'
    });

    res.cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: accessTokenExpiresIn,
        path: '/'
    });
  }

  private clearResetPasswordCookies(res: Response) {
    res.clearCookie('access_token', { path: '/' });
  }

  private setAuthCookies(res: Response, tokens: any) {
    const isProduction = process.env.NODE_ENV === 'production';

    // Get expiration times from config and convert to milliseconds
    const accessTokenExpiresIn = this.parseDurationToMs(
        this.configService.get<string>('JWT_AUTH_EXPIRES_IN', '1d')
    );
    
    const refreshTokenExpiresIn = this.parseDurationToMs(
        this.configService.get<string>('JWT_AUTH_REFRESH_EXPIRES_IN', '15d')
    );

    // Set cookies with calculated expiration times
    res.cookie('token_type', 'AUTH_TOKEN', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: accessTokenExpiresIn,
        path: '/'
    });
    
    // Access token
    res.cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: accessTokenExpiresIn,
        path: '/'
    });

    // Refresh token
    res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: refreshTokenExpiresIn,
        path: '/auth' // Should match your refresh endpoint path
    });

    // User ID
    res.cookie('user_id', tokens.userId, {
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: accessTokenExpiresIn,
        path: '/'
    });
}

/**
 * Converts duration string to milliseconds
 * @example "1d" → 86400000
 * @example "2h" → 7200000
 * @example "30m" → 1800000
 */
private parseDurationToMs(duration: string): number {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) {
        throw new Error(`Invalid duration format: ${duration}`);
    }

    const amount = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
        case 's': return amount * 1000;
        case 'm': return amount * 60 * 1000;
        case 'h': return amount * 60 * 60 * 1000;
        case 'd': return amount * 24 * 60 * 60 * 1000;
        default: throw new Error(`Unknown duration unit: ${unit}`);
    }
}

  private clearAuthCookies(res: Response) {
        res.clearCookie('access_token', { path: '/' });
        res.clearCookie('refresh_token', { path: '/auth' });
        res.clearCookie('user_id', { path: '/' });
  }

}

export default AuthController;
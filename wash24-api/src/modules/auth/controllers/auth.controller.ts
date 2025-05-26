import { Request, Response } from 'express';
import { Controller, Post, Get, Param, Req, Res, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../services/auth.service';
import AuthGuard from '../guards/jwt.auth-guard';

@Controller('/api/auth')
class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService
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

  @Get('verify/:token')
  public async verify(@Param('token') token: string, @Res() res: Response): Promise<void> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      res.json({ message: 'Token is valid', decoded });
    } catch (err) {
      res.status(500).json({ error: 'Error verifying token' });
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
  async signin(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {      
    console.log('Received signin request:', req.body);
    const data =  { username: req.body.username,
      password: req.body.password,
      systemType: req.body.system,
      deviceType: req.body.deviceType,
      deviceId: req.body.deviceId,
      ipAddress: (typeof req.headers['x-forwarded-for'] === 'string'
        ? req.headers['x-forwarded-for']
        : Array.isArray(req.headers['x-forwarded-for'])
          ? req.headers['x-forwarded-for'][0]
          : req.socket.remoteAddress) || '',
       userAgent: typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'] : ''};
      const token = await this.authService.signIn(data);
      res.status(200).send(token);
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) {
        res.status(400).send(error.getResponse());
        return;
      }
      res.status(500).send({ message: 'Internal Server Error' });
    }
  }
}

export default AuthController;
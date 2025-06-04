// token.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from '../schemas/token.schema';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../identity/schemas/user.schema';
import { SystemType, DeviceType, TokenType } from '../enums/auth.enums';


@Injectable()
export class TokenService {

  private readonly logger = new Logger(TokenService.name);

  constructor(
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService) {
  }

  async createToken(tokenData: Partial<Token>) {
    return this.tokenModel.create(tokenData);
  }

  async isTokenRevoked(jti: string): Promise<boolean> {
    const token = await this.tokenModel.findOne({ jti }).exec();
    return token?.isRevoked || false; // Returns true if revoked or not found
  }

  async revokeToken(jti: string) {
    return this.tokenModel.updateOne({ jti }, { isRevoked: true, revokedAt: new Date() });
  }

  async revokeTokensForUser(userId: string) {
    await this.tokenModel.updateMany(
      { userId, isRevoked: false }, // Find all active tokens for this user
      { $set: { isRevoked: true } } // Mark them as revoked
    );
  }

  async findTokenByJti(jti: string): Promise<Token | null> {
    return this.tokenModel.findOne({ jti });
  }

  async findValidToken(jti: string) {
    return this.tokenModel.findOne({
      jti,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    });
  }

  async createOTPToken(user: User,
        systemType: SystemType,
        deviceType: DeviceType,
        deviceId: string,
        ipAddress: string,
        userAgent: string,
        type: string) {
      const accessTokenExpiresIn = this.configService.get<string>('JWT_FORGET_PASSWORD_EXPIRES_IN', '1m');
      const refreshTokenExpiresIn = this.configService.get<string>('JWT_FORGET_PASSWORD_REFRESH_EXPIRES_IN', '1m');
      return await this .createUserToken(user, 
        systemType,
        deviceType,
        deviceId,
        ipAddress,
        userAgent,
        type,
        accessTokenExpiresIn,
        refreshTokenExpiresIn
      );
  }


  async createAuthenticationToken(
        user: User,
        systemType: SystemType,
        deviceType: DeviceType,
        deviceId: string,
        ipAddress: string,
        userAgent: string) {
      const accessTokenExpiresIn = this.configService.get<string>('JWT_AUTH_EXPIRES_IN', '1d');
      const refreshTokenExpiresIn = this.configService.get<string>('JWT_AUTH_REFRESH_EXPIRES_IN', '15d');
      return await this .createUserToken(user, 
        systemType,
        deviceType,
        deviceId,
        ipAddress,
        userAgent,
        TokenType.AUTHENTICATION_VALIDATION,
        accessTokenExpiresIn,
        refreshTokenExpiresIn
      );
  }

  async createUserToken(
        user: User,
        systemType: SystemType,
        deviceType: DeviceType,
        deviceId: string,
        ipAddress: string,
        userAgent: string,
        type: string,
        accessTokenExpiresIn: string,
        refreshTokenExpiresIn: string
        ) {
        this.logger.debug({
            message: 'Creating user token',
            userId: user.id,
            systemType,
            deviceType,
            deviceId,
            ipAddress,
            userAgent
        });

        const authorities: string[] = user.roles.map((role: any) => role.name);

        const payload = {
            userId: user.id,
            username: user.username,
            roles: authorities,
            jti: uuidv4(),
            systemType,
            deviceId
        };

        const parseExpiresIn = (expiresIn: string) => {
            if (/^\d+$/.test(expiresIn)) return parseInt(expiresIn, 10);
            if (expiresIn.endsWith('d')) return parseInt(expiresIn) * 86400;
            if (expiresIn.endsWith('h')) return parseInt(expiresIn) * 3600;
            if (expiresIn.endsWith('m')) return parseInt(expiresIn) * 60;
            return 86400; // default 1 day
        };

        const newAccessToken = this.jwtService.sign(payload, { expiresIn: accessTokenExpiresIn });
        const newRefreshToken = this.jwtService.sign(payload, { expiresIn: refreshTokenExpiresIn });

        this.logger.debug({
            message: 'Tokens generated',
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

        await this.createToken({
            jti: payload.jti,
            userId: user.id,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            isRevoked: false,
            systemType,
            deviceType,
            deviceId,
            ipAddress,
            userAgent,
            type
        });

        this.logger.debug({
            message: 'Token saved to database',
            jti: payload.jti,
            userId: user.id,
            systemType,
            deviceType,
            deviceId,
            ipAddress,
            userAgent
        });

        return {
            jti: payload.jti,
            userId: user._id,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            accessTokenExpires: parseExpiresIn(accessTokenExpiresIn),
            refreshTokenExpires: parseExpiresIn(refreshTokenExpiresIn)
        };
    }

}
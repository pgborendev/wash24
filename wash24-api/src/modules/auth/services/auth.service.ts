import { BadRequestException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { TokenService } from "./token.service";
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { UserService } from "../../identity/services/user.service";
import { SystemType, DeviceType, TokenType } from '../enums/auth.enums';
import { OtpService } from '../services/otp.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly jwtService: JwtService,
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
        private readonly otpService: OtpService,
    ) {}

    async validateSystemDevice(systemType: SystemType, deviceType: DeviceType): Promise<boolean> {
        const validCombinations = {
            [SystemType.WASH24_WEB_POS]: [DeviceType.DESKTOP, DeviceType.TABLET],
            [SystemType.WASH24_MECHAN]: [DeviceType.ESP32],
            [SystemType.WASH24_ADMIN]: [DeviceType.DESKTOP],
            [SystemType.WASH24_APP]: [DeviceType.MOBILE, DeviceType.TABLET],
            [SystemType.WASH24_DEVICE_CONTROLER]: [DeviceType.ESP32]
        };
        return validCombinations[systemType]?.includes(deviceType) ?? false;
    }

    private async assertValidSystemDevice(systemType: SystemType, deviceType: DeviceType, ipAddress: string, userAgent: string) {
        if (!await this.validateSystemDevice(systemType, deviceType)) {
            this.logger.warn({
                event: 'AUTH_FAILURE',
                message: 'Invalid system-device combination',
                systemType,
                deviceType,
                ipAddress,
                userAgent
            });
            throw new BadRequestException('Invalid system-device combination');
        }
    }

    async signOut(accessToken: string) {
        const startTime = Date.now();
        const correlationId = uuidv4();
        this.logger.debug(`[${correlationId}] Sign-out started - AccessToken:${accessToken}`);

        try {
            const decoded = await this.jwtService.verifyAsync(accessToken);
            const token = await this.tokenService.findTokenByJti(decoded.jti);

            if (!token) {
                throw new BadRequestException({ error: 401, message: 'Invalid access token' });
            }
            if (token.isRevoked) {
                throw new BadRequestException({ error: 402, message: 'This accesstoken has been revoked' });
            }
            await this.tokenService.revokeToken(token.jti);
            return { message: 'User signed out successfully' };
        } catch (error: any) {
            this.logger.error({
                message: 'Sign-out failed',
                error: {
                    name: error.name,
                    message: error.message,
                    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
                },
                input: { accessToken },
                correlationId
            });
            throw error;
        } finally {
            const endTime = Date.now();
            const duration = endTime - startTime;
            this.logger.debug(`[${correlationId}] Sign-out completed - Duration: ${duration}ms`);
        }
    }

    async refresh(data: any) {
        const startTime = Date.now();
        const correlationId = uuidv4();
        this.logger.debug(`[${correlationId}] Refresh token started - RefreshToken:${data.refreshToken}`);

        try {
            this.logger.debug({
                message: 'Refreshing token',
                refreshToken: data.refreshToken,
                systemType: data.systemType,
                deviceType: data.deviceType,
                deviceId: data.deviceId,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent
            });

            const decoded = await this.jwtService.verifyAsync(data.refreshToken);
            const token = await this.tokenService.findTokenByJti(decoded.jti);

            if (!token) {
                this.logger.warn({
                    event: 'AUTH_FAILURE',
                    message: 'Invalid refresh token',
                    refreshToken: data.refreshToken,
                    systemType: data.systemType,
                    deviceType: data.deviceType,
                    deviceId: data.deviceId,
                    ipAddress: data.ipAddress,
                    userAgent: data.userAgent
                });
                throw new BadRequestException({ error: 401, message: 'Invalid refresh token' });
            }

            if (token.isRevoked) {
                this.logger.warn({
                    event: 'AUTH_FAILURE',
                    message: 'This refresh token has been revoked',
                    refreshToken: data.refreshToken,
                    systemType: data.systemType,
                    deviceType: data.deviceType,
                    deviceId: data.deviceId,
                    ipAddress: data.ipAddress,
                    userAgent: data.userAgent
                });
                throw new BadRequestException({ error: 402, message: 'This refreshtoken has been revoked' });
            }

            const user = await this.userService.get(decoded.userId);
            if (!user) {
                this.logger.warn({
                    event: 'AUTH_FAILURE',
                    message: 'User not found',
                    userId: decoded.userId
                });
                throw new BadRequestException({ error: 403, message: 'Invalid user id' });
            }

            await this.assertValidSystemDevice(
                data.systemType,
                data.deviceType,
                data.ipAddress,
                data.userAgent
            );

            await this.tokenService.revokeToken(token.jti);
            this.logger.log({
                message: 'Token revoked',
                jti: token.jti,
            });

            this.logger.debug({
                message: 'Creating new user token',
                userId: user.id,
                systemType: data.systemType,
                deviceType: data.deviceType,
                deviceId: data.deviceId,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent
            });

            return await this.tokenService.createAuthenticationToken(
                user,
                data.systemType,
                data.deviceType,
                data.deviceId,
                data.ipAddress,
                data.userAgent
            );
        } catch (error: any) {
            this.logger.error({
                message: 'Refresh token failed',
                error: {
                    name: error.name,
                    message: error.message,
                    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
                },
                input: {
                    refreshToken: data.refreshToken,
                    systemType: data.systemType
                }
            });
            throw error;
        } finally {
            const endTime = Date.now();
            const duration = endTime - startTime;
            this.logger.debug(`[${correlationId}] Refresh token completed - Duration: ${duration}ms`);
        }
    }

    async signIn(data: any) {
        const startTime = Date.now();
        const correlationId = uuidv4();
        this.logger.debug(`[${correlationId}] Sign-in started - Identifier:${data.identifier}`);

        try {
            this.logger.debug(`[${correlationId}] Sign-in data: ${JSON.stringify(data)}`);

            if (!data.username || !data.password) {
                this.logger.warn({
                    event: 'AUTH_FAILURE',
                    message: 'Identifier or password not provided',
                    ip: data.ipAddress,
                    userAgent: data.userAgent,
                    correlationId
                });
                throw new BadRequestException({
                    error: 400,
                    message: 'Identifier and password are required.',
                });
            }

            const user = await this.getUser(data.username);

            if (!user) {
            this.logger.warn({
                event: 'AUTH_FAILURE',
                message: 'User not found',
                identifier: data.username,
                ip: data.ipAddress,
                userAgent: data.userAgent,
                correlationId
            });
            throw new BadRequestException({
                error: 404,
                message: 'Could not find account with this username.',
            });
        }

            const passwordIsValid = await bcrypt.compare(data.password, user.password);
            if (!passwordIsValid) {
                this.logger.warn({
                    event: 'AUTH_FAILURE',
                    message: 'Incorrect password',
                    userId: user.id,
                    identifier: data.username,
                    ip: data.ipAddress,
                    userAgent: data.userAgent,
                    correlationId
                });
                throw new BadRequestException({
                    error: 401,
                    message: 'Incorrect password. Please try again.',
                });
            }

            await this.assertValidSystemDevice(
                data.systemType,
                data.deviceType,
                data.ipAddress,
                data.userAgent
            );

            this.logger.log({
                message: 'User signed in',
                userId: user.id,
                identifierType: data.username.includes('@') ? 'email' :
                    /^\+?[0-9\s\-]+$/.test(data.username) ? 'phone' : 'username',
                deviceType: data.deviceType,
                systemType: data.systemType,
                correlationId
            });

            return await this.tokenService.createAuthenticationToken(
                user,
                data.systemType,
                data.deviceType,
                data.deviceId,
                data.ipAddress,
                data.userAgent
            );

            
        } catch (error: any) {
            this.logger.error({
                message: 'Sign-in failed',
                error: {
                    name: error.name,
                    message: error.message,
                    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
                },
                input: {
                    identifier: data.username,
                    systemType: data.systemType
                },
                correlationId
            });
            throw error;
        } finally {
            const endTime = Date.now();
            const duration = endTime - startTime;
            this.logger.debug(`[${correlationId}] Sign-in completed - Duration: ${duration}ms`);
        }
    }

    async changePassword(data: any) {
        const username = data.username;
        const password = data.password;
        const user = await this.getUser(username);
        if (!user) {
            this.logger.warn({
                event: 'CHANGE_USER_PASSWORD_FAILURE',
                message: 'User not found',
                identifier: data.username
            });
            throw new BadRequestException({
                error: 404,
                message: 'Could not find account with this username.',
            });
        }
        await this.userService.updateUserPassword(user.id, password);
    }

    async getUser(identity: string) {
        const correlationId = uuidv4();
        this.logger.debug(`[${correlationId}] Attempting username login`);
        return await this.userService.findByUsername(identity.toLowerCase().trim());
    }

}
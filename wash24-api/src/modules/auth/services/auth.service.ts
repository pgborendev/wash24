import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { DeviceType, SystemType } from "../enums/auth.enums";
import { TokenService } from "./token.service";

import { v4 as uuidv4 } from 'uuid';

import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { UserService } from "../../identity/services/user.service";
import { User } from "../../identity/schemas/user.schema";

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly jwtService: JwtService,
        private readonly tokenService: TokenService,
        private readonly configService: ConfigService,
        private readonly userService: UserService
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

    async signOut(accessToken: string) {
        const startTime = Date.now();
        const correlationId =  uuidv4();
        this.logger.debug(`[${correlationId}] Sign-out started - AccessToken:${accessToken}`);

        try {
            const decoded = await this.jwtService.verifyAsync(accessToken);
            const token = await this.tokenService.findTokenByJti(decoded.jti);

            if (!token) {
                throw new BadRequestException({ error: 401, message: 'Invalid access token'});
            }
            if (token.isRevoked) {
                throw new BadRequestException({error: 402, message: 'This accesstoken has been revoked'});
            }
            await this.tokenService.revokeToken(token.jti);
            return { message: 'User signed out successfully' };
        }
        catch (error: any) {
            this.logger.error({
                message: 'Sign-out failed',
                error: {
                    name: error.name,
                    message: error.message,
                    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
                },
                input: {
                    accessToken
                },
                correlationId
            });
            throw error;
        }
        finally {
            const endTime = Date.now();
            const duration = endTime - startTime;
            this.logger.debug(`[${correlationId}] Sign-out completed - Duration: ${duration}ms`);
        }

        
    }

    // @Throttle({ default: { limit: 5, ttl: 60 } })
    async refresh(data: any) {

        const startTime = Date.now();
        const correlationId =  uuidv4();
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
            throw new BadRequestException({ error: 401, message: 'Invalid refresh token'});
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
            throw new BadRequestException({error: 402, message: 'This refreshtoken has been revoked'});
        }

        const user = await this.userService.get(decoded.userId);
        if (!user) {
            this.logger.warn({
                event: 'AUTH_FAILURE',
                message: 'User not found',
                userId: decoded.userId
            });
            throw new BadRequestException({ error: 403, message: 'Invalid user id'});
        }

        if (!await this.validateSystemDevice(data.systemType, data.deviceType)) {
            this.logger.warn({
                event: 'AUTH_FAILURE',
                message: 'Invalid system-device combination',
                systemType: data.systemType,
                deviceType: data.deviceType
            });
            throw new BadRequestException('Invalid system-device combination');
        }

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
        return await this.createUserToken(
            user,
            data.systemType,
            data.deviceType,
            data.deviceId,
            data.ipAddress,
            data.userAgent
        );

        }
        catch (error: any) {
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
        }
        finally {
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

            if (!data.identifier || !data.password) {
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

            // Determine identifier type and find user
            let user;
            if (data.identifier.includes('@')) {
                // Email login
                this.logger.debug(`[${correlationId}] Attempting email login`);
                user = await this.userService.findByEmail(data.identifier.toLowerCase().trim());
            } else if (/^\+?[0-9\s\-]+$/.test(data.identifier)) {
                // Phone login
                const phone = data.identifier.replace(/[^0-9+]/g, '');
                this.logger.debug(`[${correlationId}] Attempting phone login: ${phone}`);
                user = await this.userService.findByPhone(phone);
            } else {
                // Username login
                this.logger.debug(`[${correlationId}] Attempting username login`);
                user = await this.userService.findByUsername(data.identifier.toLowerCase().trim());
            }

            if (!user) {
                this.logger.warn({
                    event: 'AUTH_FAILURE',
                    message: 'User not found',
                    identifier: data.identifier,
                    identifierType: data.identifier.includes('@') ? 'email' : 
                                /^\+?[0-9\s\-]+$/.test(data.identifier) ? 'phone' : 'username',
                    ip: data.ipAddress,
                    userAgent: data.userAgent,
                    correlationId
                });
                throw new BadRequestException({
                    error: 404,
                    message: 'User not found.',
                });
            }

            const passwordIsValid = await bcrypt.compare(data.password, user.password);
            if (!passwordIsValid) {
                this.logger.warn({
                    event: 'AUTH_FAILURE',
                    message: 'Invalid password',
                    userId: user.id,
                    identifier: data.identifier,
                    ip: data.ipAddress,
                    userAgent: data.userAgent,
                    correlationId
                });
                throw new BadRequestException({
                    error: 401,
                    message: 'Invalid credentials',
                });
            }

            this.logger.log({
                message: 'User signed in',
                userId: user.id,
                identifierType: data.identifier.includes('@') ? 'email' : 
                            /^\+?[0-9\s\-]+$/.test(data.identifier) ? 'phone' : 'username',
                deviceType: data.deviceType,
                systemType: data.systemType,
                correlationId
            });

            return await this.createUserToken(
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
                    identifier: data.identifier,
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
    
    async createUserToken(
        user: User,
        systemType: SystemType,
        deviceType: DeviceType,
        deviceId: string,
        ipAddress: string,
        userAgent: string) {

        this.logger.debug({
            message: 'Creating user token', 
            userId: user.id,
            systemType,
            deviceType,
            deviceId,
            ipAddress,
            userAgent
        });


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

        const accessTokenExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '1d');
        const refreshTokenExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '15d');

        const newAccessToken = this.jwtService.sign(payload, {expiresIn: accessTokenExpiresIn});
        const newRefreshToken = this.jwtService.sign(payload, {expiresIn: refreshTokenExpiresIn});

        this.logger.debug({
            message: 'Tokens generated',
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

        await this.tokenService.createToken({
            jti: payload.jti,
            userId: user.id,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            isRevoked: false,
            systemType: systemType,
            deviceType: deviceType,
            deviceId: deviceId,
            ipAddress: ipAddress,
            userAgent: userAgent,
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

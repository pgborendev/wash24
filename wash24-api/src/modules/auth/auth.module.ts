import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { Token, TokenSchema } from "./schemas/token.schema";
import { AuthService } from "./services/auth.service";

import { TokenService } from "./services/token.service";
import { IdentityModule } from "../identity/identity.module";
import AuthController from "./controllers/auth.controller";
import AuthGuard from "./guards/jwt.auth-guard";
import { RoleGuard } from "./guards/role.guard";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { OtpService } from "./services/otp.service";
import { OTP, OTPSchema } from "./schemas/otp.schema";
import { MailModule } from "../mail/mail.module";

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>("JWT_SECRET_KEY"),
				signOptions: {
					expiresIn: configService.get<string>("JWT_EXPIRES_IN", "1d"),
				},
			}),
			inject: [ConfigService],
		}),

		MongooseModule.forFeature([
			{ name: Token.name, schema: TokenSchema },
			{ name: OTP.name, schema: OTPSchema },
		]),
		forwardRef(() => IdentityModule),
		MailModule,
	],
	controllers: [AuthController],
	providers: [TokenService, AuthService, AuthGuard, RoleGuard, OtpService],
	exports: [AuthService, AuthGuard, RoleGuard, TokenService, OtpService, JwtModule], // Export TokenService
})
export class AuthModule {}

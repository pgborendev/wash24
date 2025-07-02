import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "../services/token.service";

@Injectable()
export class VerifyOtpGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private tokenService: TokenService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();
		const token = req.cookies?.VERIFY_OTP_TOKEN;

		try {
			if (!token) {
				throw new UnauthorizedException("Access token is required");
			}

			const payload = this.jwtService.verify(token);
			if (!payload?.jti) {
				throw new UnauthorizedException("Invalid access token");
			}

			const tokenRecord = await this.tokenService.findTokenByJti(payload.jti);
			if (!tokenRecord) {
				throw new UnauthorizedException("Invalid access token");
			}

			if (tokenRecord.isRevoked) {
				throw new UnauthorizedException("Access token revoked");
			}

			req.payload = {
				userId: payload.userId,
				roles: payload.roles,
				jti: payload.jti,
			};
			return true;
		} catch (error) {
			console.error(`OTP verification failed: ${error.message}`);
			throw new UnauthorizedException("Invalid or expired OTP token");
		}
	}
}

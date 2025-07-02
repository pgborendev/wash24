import { InjectModel } from "@nestjs/mongoose";
import { PaginateModel } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { OTP } from "../schemas/otp.schema";
import { generateOtp } from "../utils/generate-otp.util";
import { UserService } from "../../identity/services/user.service";
import { MailService } from "../../mail/services/email.service";
import { BaseService } from "src/modules/core/services/base.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OtpService extends BaseService<OTP> {
	constructor(
		@InjectModel(OTP.name) model: PaginateModel<OTP>,
		private readonly userService: UserService,
		private readonly mailService: MailService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {
		super(model);
	}

	protected getPopulation(): string[] {
		return [];
	}

	async createOtp(username: string): Promise<{ otp: string }> {
		await this.model.deleteMany({ username });
		const otp = generateOtp();
		await new this.model({ username, otp }).save();
		return { otp };
	}

	async isValidOtp(otp: string): Promise<boolean> {
		const otpRecord = await this.model.findOne({
			otp: otp,
		});

		if (!otpRecord) {
			return false;
		}
		return true;
	}
}

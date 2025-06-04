import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OTP } from '../schemas/otp.schema';
import { generateOtp } from '../utils/generate-otp.util';
import { UserService } from '../../identity/services/user.service';
import { MailService } from '../../mail/services/email.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(OTP.name) private readonly otpModel: Model<OTP>,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createOtp(username: string): Promise<{ otp: string }> {
    await this.otpModel.deleteMany({ username });
    const otp = generateOtp();
    await new this.otpModel({ username, otp }).save();
    return { otp };
  }

  async isValidOtp(username: string, otp: string): Promise<boolean> {
    
    const otpRecord = await this.otpModel.findOne({
      username,
      otp,
    });

    if (!otpRecord) {
      return false;
    }
    return true;
  }
}
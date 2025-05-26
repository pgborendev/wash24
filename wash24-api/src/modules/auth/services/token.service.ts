// token.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from '../schemas/token.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<Token>,
  ) {}

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
}
// token.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Token extends Document {
  
  @Prop({ required: true, unique: true })
  jti: string;

  @Prop({ required: true })
  userId: string;

  @Prop()
  accessToken: string;

  @Prop()
  refreshToken: string;

  @Prop({ default: false })
  isRevoked: boolean;

  @Prop({ required: false })
  revokedAt: Date;

  @Prop()
  systemType: string;  

  @Prop()
  deviceType: string;

  @Prop()
  deviceId?: string; 

  @Prop()
  ipAddress?: string; 

  @Prop()
  userAgent?: string; 

  @Prop()
  location?: string;

  @Prop()
  type?: string;

}

export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.index({ userId: 1, system: 1, deviceType: 1 });
// token.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class OTP extends Document {
  
  @Prop({required: true})
  username: string;

  @Prop({required: true})
  otp: string;

  @Prop({ default: Date.now, expires: '10m' }) 
  createdAt: Date;
  
}

export const OTPSchema = SchemaFactory.createForClass(OTP);

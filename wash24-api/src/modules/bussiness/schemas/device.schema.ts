// role.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Program } from './program.schema';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      return ret;
    }
  }
})
export class Device extends Document {

   @Prop({
        type: String,
        required: true,
        trim: true
   })
   deviceId: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true
  })
  description: string;

  @Prop({
      type: String,
      required: true,
      enum: ['WASHING_MACHINE', 'DRYER_MACHINE', 'VENDING_MACHINE'],
      trim: true
  })
  type: string;

  @Prop({
    type: String,
    required: true,
    enum: ['POWER_OFF', 'POWER_ON', 'FILLING', 'WASHING', 'RINSING', 'SPINING', 'ERROR', 'MAINTENANCE'],
    trim: true
  })
  status: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: Program.name }] }) 
  programs: Types.ObjectId[];

}

export const DeviceSchema = SchemaFactory.createForClass(Device);
DeviceSchema.plugin(mongoosePaginate); 
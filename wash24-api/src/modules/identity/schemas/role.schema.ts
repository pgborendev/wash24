// role.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      return ret;
    }
  }
})
export class Role extends Document {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true
  })
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
RoleSchema.plugin(mongoosePaginate); 
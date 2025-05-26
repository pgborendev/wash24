// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Role } from '../schemas/role.schema';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.password;
      return ret;
    }
  }
})
export class User extends Document {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address']
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    minlength: 6,
    select: false
  })
  password: string;

  @Prop({
    type: String,
    required: false
  })
  phonenumber: string;

  @Prop({ type: Boolean, default: true })
  enable: boolean;

  avatar?: Types.ObjectId;
  
  @Prop({ type: [{ type: Types.ObjectId, ref: Role.name }] }) 
  roles: Types.ObjectId[]; // Simplified type

  @Prop({ type: Boolean, default: true })
  deletable: boolean;


  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add pagination plugin
UserSchema.plugin(mongoosePaginate);

// Password hashing middleware
UserSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.deleted = false;
    next();
  } catch (err) {
    next(err as import('mongoose').CallbackError);
  }
});

// Add any virtuals or methods here if needed
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};
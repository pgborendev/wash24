// user-create.dto.ts
import { IsNotEmpty, IsEmail, IsString, isNotEmpty, MaxLength, Validate } from 'class-validator';
import { BaseDto } from './base.dto';

import { IsUniqueValidator } from '../validator/IsUniqueValidator';

export class UserCreateDto extends BaseDto {

  @IsNotEmpty()
  @IsString()
  @Validate(IsUniqueValidator, ['User', 'username'])
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @Validate(IsUniqueValidator, ['User', 'email'])
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  roles: string[];

  enable: boolean;

  deletable: boolean;
  
}

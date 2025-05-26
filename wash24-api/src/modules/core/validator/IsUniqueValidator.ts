import { InjectConnection } from "@nestjs/mongoose";
import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Connection } from "mongoose";

@ValidatorConstraint({ name: 'IsUnique', async: true })
@Injectable()
export class IsUniqueValidator implements ValidatorConstraintInterface {

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [modelName, field = args.property] = args.constraints;
    const model = this.connection.model(modelName);
    
    const existingDoc = await model.findOne({ [field]: value }).exec();
    
    if (!existingDoc) return true;
    
    const updatingDoc = args.object as { _id?: string };
    return updatingDoc?._id === existingDoc._id.toString();
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be unique`;
  }
}
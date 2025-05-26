import { Get, Post, Query, Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseService } from '../../core/services/base.service';
import { Profile } from '../schemas/profile.schema';

@Injectable()
class ProfileService extends BaseService<Profile> {

    constructor(@InjectModel(Profile.name) model: PaginateModel<Profile>) {
      super(model);
    }
  
    protected getPopulation(): string[] {
      return []; 
    }

    async findByUserId(userId: string): Promise<Profile | null> {
      return this.model.findOne({ user: userId }).exec();
    }

}

export { ProfileService };
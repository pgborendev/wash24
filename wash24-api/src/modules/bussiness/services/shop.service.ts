import { Get, Post, Query, Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseService } from '../../core/services/base.service';
import { Shop } from '../schemas/shop.schema';

@Injectable()
class ShopService extends BaseService<Shop> {

    constructor(@InjectModel(Shop.name) model: PaginateModel<Shop>) {
      super(model);
    }
  
    protected getPopulation(): string[] {
      return []; 
    }

}

export { ShopService };
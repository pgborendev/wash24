import { Get, Post, Query, Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseService } from '../../core/services/base.service';
import { Item } from '../schemas/item.schema';

@Injectable()
class ItemService extends BaseService<Item> {

    constructor(@InjectModel(Item.name) model: PaginateModel<Item>) {
      super(model);
    }
  
    protected getPopulation(): string[] {
      return []; 
    }

}

export { ItemService };
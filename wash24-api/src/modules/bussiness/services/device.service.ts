import { Get, Post, Query, Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { BaseService } from '../../core/services/base.service';
import { Device } from '../schemas/device.schema';

@Injectable()
class DeviceService extends BaseService<Device> {

    constructor(@InjectModel(Device.name) model: PaginateModel<Device>) {
      super(model);
    }
  
    protected getPopulation(): string[] {
      return ["programs"]; 
    }

}

export { DeviceService };
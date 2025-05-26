import { Controller, Inject, UseGuards } from '@nestjs/common';
import { BaseController } from "../../core/controllers/base.controller";
import { Shop } from '../schemas/shop.schema';
import { ShopService } from '../services/shop.service';


@Controller('/api/shops')
class ShopController extends BaseController<Shop> {

  constructor(@Inject(ShopService) service: ShopService) {
    super(service);
  }
 
}

export { ShopController };

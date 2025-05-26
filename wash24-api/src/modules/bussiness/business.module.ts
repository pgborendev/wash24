import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { Shop, ShopSchema } from './schemas/shop.schema';
import { ShopController } from './controllers/shop.controller';
import { ShopService } from './services/shop.service';
import { DeviceController } from './controllers/device.controller';
import { ItemController } from './controllers/item.controller';
import { DeviceService } from './services/device.service';
import { ItemService } from './services/item.service';
import { Device, DeviceSchema } from './schemas/device.schema';
import { Item, ItemSchema } from './schemas/item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shop.name, schema: ShopSchema},
      { name: Device.name, schema: DeviceSchema},
      { name: Item.name, schema: ItemSchema}
    ]),
  ],
  controllers: [ShopController, DeviceController, ItemController],
  providers: [ShopService, DeviceService, ItemService],
  exports: [ShopService, DeviceService, ItemService],
})


export class BusinessModule {}

import { 
  Controller, 
  Post, 
  Body, 
  UploadedFile, 
  UseInterceptors, 
  Put, 
  Param, 
  Delete,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Inject
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ShopService } from '../services/shop.service';
import { BaseController } from '../../core/controllers/base.controller';
import { Shop } from '../schemas/shop.schema';

@Controller('/api/shops')
export class ShopController extends BaseController<Shop> {

  protected readonly shopService: ShopService;

  constructor(@Inject(ShopService) shopService: ShopService) {
    super(shopService);
    this.shopService = shopService;
  }

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() createShopDto: any,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
          new FileTypeValidator({ fileType: 'image/(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    logoFile?: Express.Multer.File,) {    
    return this.shopService.createWithLogo(createShopDto, logoFile);
  }

  @Put(':id/logo')
  @UseInterceptors(FileInterceptor('logo'))
  async updateLogo(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
          new FileTypeValidator({ fileType: 'image/(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    logoFile: Express.Multer.File,
  ) {
    return this.shopService.updateLogo(id, logoFile);
  }

}
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { Shop } from '../schemas/shop.schema';
import { FileUploadService } from '../../fileupload/services/fileupload.service';
import { BaseService } from '../../core/services/base.service';

@Injectable()
export class ShopService extends BaseService<Shop> {

  constructor(@InjectModel(Shop.name) model: PaginateModel<Shop>,
    private readonly fileUploadService: FileUploadService,) {
    super(model);
  }

    protected getPopulation(): string[] {
      return []; 
    }

  async createWithLogo(createShopDto: any, logoFile?: Express.Multer.File): Promise<Shop> {
    const shopData = { ...createShopDto };
    
    if (logoFile) {
      shopData.logo = await this.fileUploadService.saveFile(logoFile, 'shops');
    }

    const createdShop = new this.model(shopData);
    return createdShop.save();
  }

  async updateLogo(shopId: string, logoFile: Express.Multer.File): Promise<Shop> {
    const shop = await this.model.findById(shopId);
    
    if (!shop) {
      throw new Error('Shop not found');
    }

    // Delete old logo if exists
    if (shop.logo) {
      await this.fileUploadService.deleteFile(shop.logo);
    }

    // Save new logo
    shop.logo = await this.fileUploadService.saveFile(logoFile, 'shops');
    return shop.save();
  }

  async deleteShop(shopId: string): Promise<void> {
    const shop = await this.model.findByIdAndDelete(shopId);
    
    if (shop?.logo) {
      await this.fileUploadService.deleteFile(shop.logo);
    }
  }
}
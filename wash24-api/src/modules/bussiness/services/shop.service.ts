import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PaginateModel } from "mongoose";
import { Shop } from "../schemas/shop.schema";
import { FileUploadService } from "../../fileupload/services/fileupload.service";
import { BaseService } from "../../core/services/base.service";

@Injectable()
export class ShopService extends BaseService<Shop> {
	constructor(
		@InjectModel(Shop.name) model: PaginateModel<Shop>,
		private readonly fileUploadService: FileUploadService,
	) {
		super(model);
	}

	protected getPopulation(): string[] {
		return [];
	}

	async createWithLogo(
		createShopDto: any,
		ownerId: string,
		logoFile?: Express.Multer.File,
	): Promise<Shop> {
		const shopData = { ...createShopDto, owner: ownerId } as Shop;
		if (logoFile) {
			shopData.logo = await this.fileUploadService.saveFile(logoFile, "shops");
		}
		const createdShop = new this.model(shopData);
		return createdShop.save();
	}

	async updateWithLogo(
		_id: string,
		shop: Shop,
		logoFile?: Express.Multer.File): Promise<Shop> {

		const existingDoc = await this.model.findById(_id).exec();

		if (!existingDoc) {
			throw new NotFoundException(`Document with ID ${_id} not found`);
		}

		if ("deleted" in existingDoc && existingDoc["deleted"]) {
			throw new ForbiddenException("Cannot update a document marked as deleted");
		}
		if (logoFile) {
			shop.logo = await this.fileUploadService.saveFile(logoFile, "shops");
		}

		const updatedShop = await this.model
			.findByIdAndUpdate(_id, { $set: shop }, { new: true, runValidators: true })
			.populate(this.getPopulation())
			.orFail(() => new NotFoundException(`Document with ID ${_id} not found after update`))
			.exec();

		return updatedShop;
	}

	async updateLogo(shopId: string, logoFile: Express.Multer.File): Promise<Shop> {
		const shop = await this.model.findById(shopId);

		if (!shop) {
			throw new Error("Shop not found");
		}

		// Delete old logo if exists
		if (shop.logo) {
			await this.fileUploadService.deleteFile(shop.logo);
		}

		// Save new logo
		shop.logo = await this.fileUploadService.saveFile(logoFile, "shops");
		return shop.save();
	}

	async deleteShop(shopId: string): Promise<void> {
		const shop = await this.model.findByIdAndDelete(shopId);

		if (shop?.logo) {
			await this.fileUploadService.deleteFile(shop.logo);
		}
	}
}

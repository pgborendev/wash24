import { Controller, Inject } from "@nestjs/common";
import { BaseController } from "../../core/controllers/base.controller";

import { Item } from "../schemas/item.schema";
import { ItemService } from "../services/item.service";

@Controller("/api/items")
class ItemController extends BaseController<Item> {
	constructor(@Inject(ItemService) service: ItemService) {
		super(service);
	}
}

export { ItemController };

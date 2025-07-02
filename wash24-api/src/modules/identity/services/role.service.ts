import { Injectable } from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { PaginateModel } from "mongoose";
import { BaseService } from "../../core/services/base.service";
import { Role } from "../schemas/role.schema";

@Injectable()
class RoleService extends BaseService<Role> {
	constructor(@InjectModel(Role.name) model: PaginateModel<Role>) {
		super(model);
	}

	protected getPopulation(): string[] {
		return [];
	}

	async findByName(name: string): Promise<Role | null> {
		return this.model.findOne({ name }).exec();
	}
}

export { RoleService };

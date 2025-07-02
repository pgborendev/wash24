import {
	Get,
	Body,
	Delete,
	Param,
	Put,
	Patch,
	Post,
	Query,
	HttpStatus,
	HttpException,
} from "@nestjs/common";
import { BaseService } from "../services/base.service";
import { Document } from "mongoose";

abstract class BaseController<T extends Document> {
	protected readonly service: BaseService<T>;

	constructor(serviceInstance: BaseService<T>) {
		this.service = serviceInstance;
	}

	@Patch(":id")
	public async patch(@Param("id") id: string, @Body() data: any): Promise<any> {
		await this.service.update(id, data);
	}

	@Put(":id")
	public async put(@Param("id") id: string, @Body() data: any): Promise<any> {
		try {
			return await this.service.update(id, data);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	@Delete(":id")
	public async remove(@Param("id") id: string): Promise<any> {
		try {
			await this.service.remove(id);
			return { message: "Resource deleted successfully." };
		} catch (error) {
			throw new HttpException(
				{
					message: "Internal server error.",
					error: error.message,
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Post()
	public async post(@Body() data: any): Promise<any> {
		return await this.service.create(data);
	}

	@Get("/:id")
	public async get(@Param("id") id: string): Promise<any> {
		return await this.service.get(id);
	}

	@Get()
	public async all(@Query() query: any): Promise<any> {
		return await this.service.findAll(query);
	}
}

export { BaseController };

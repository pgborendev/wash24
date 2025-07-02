import { Controller, Inject } from "@nestjs/common";
import { BaseController } from "../../core/controllers/base.controller";

import { DeviceService } from "../services/device.service";
import { Device } from "../schemas/device.schema";

@Controller("/api/devices")
class DeviceController extends BaseController<Device> {
	constructor(@Inject(DeviceService) service: DeviceService) {
		super(service);
	}
}

export { DeviceController };

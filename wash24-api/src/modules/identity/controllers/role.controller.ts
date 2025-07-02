import { Controller, Inject, UseGuards } from "@nestjs/common";
import { BaseController } from "../../core/controllers/base.controller";
import { RoleService } from "../services/role.service";
import { Role } from "../schemas/role.schema";

import { RoleGuard } from "../../auth/guards/role.guard";

import { Roles } from "../../auth/decorators/roles.decorator";
import AuthGuard from "../../auth/guards/jwt.auth-guard";

@Controller("/api/roles")
@UseGuards(AuthGuard, RoleGuard)
@Roles("admin")
class RoleController extends BaseController<Role> {
	constructor(@Inject(RoleService) userService: RoleService) {
		super(userService);
	}
}

export { RoleController };

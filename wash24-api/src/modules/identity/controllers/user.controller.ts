import { Controller, Inject, UseGuards } from "@nestjs/common";
import { BaseController } from "../../core/controllers/base.controller";
import { UserService } from "../services/user.service";
import { Get, Query } from "@nestjs/common";
import { User } from "../schemas/user.schema";
import AuthGuard from "../../auth/guards/jwt.auth-guard";
import { RoleGuard } from "../../auth/guards/role.guard";
import { Roles } from "../../auth/decorators/roles.decorator";

@Controller("/api/users")
@UseGuards(AuthGuard, RoleGuard)
@Roles("admin")
class UserController extends BaseController<User> {
	constructor(@Inject(UserService) protected readonly service: UserService) {
		super(service);
	}

	@Get("/check-email-exists")
	public async checkEmailExists(
		@Query("email") email: string,
		@Query("id") id?: string,
	): Promise<any> {
		const userService: UserService = this.service as UserService;
		const emailExists = await userService.checkEmailExists(email, id);
		return { exist: emailExists };
	}

	@Get("/check-username-exists")
	public async checkUserNameExists(
		@Query("username") username: string,
		@Query("id") id?: string,
	): Promise<any> {
		const userService: UserService = this.service as UserService;
		const emailExists = await userService.checkUserNameExists(username, id);
		return { exist: emailExists };
	}
}

export default UserController;

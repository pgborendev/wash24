import { Injectable, Logger } from "@nestjs/common";
import { RoleService } from "../identity/services/role.service";
import { Role } from "../identity/schemas/role.schema";
import { UserService } from "../identity/services/user.service";
import { User } from "../identity/schemas/user.schema";

@Injectable()
export class SeedService {
	private readonly logger = new Logger(SeedService.name);

	constructor(
		private readonly roleService: RoleService,
		private readonly userService: UserService,
	) {}

	async seedDefaultData() {
		const adminRole: Partial<Role> = { name: "admin" };
		const userRole: Partial<Role> = { name: "user" };

		const existingRole = await this.roleService.findByName("admin");

		if (!existingRole) {
			const createdRole: any = await this.roleService.create(adminRole);
			this.logger.log(`Role ${createdRole.name} created successfully`);
		} else {
			this.logger.log(`Role ${existingRole.name} already exists`);
		}

		const existingUserRole = await this.roleService.findByName("user");
		if (!existingUserRole) {
			const createdUserRole: any = await this.roleService.create(userRole);
			this.logger.log(`Role ${createdUserRole.name} created successfully`);
		} else {
			this.logger.log(`Role ${existingUserRole.name} already exists`);
		}

		const existingAdminUser: any = await this.userService.checkUserNameExists("admin", undefined);
		const adminRoleFromDatabase = await this.roleService.findByName("admin");

		if (!existingAdminUser && adminRoleFromDatabase) {
			console.log(adminRoleFromDatabase);
			const adminUser: Partial<User> = {
				username: process.env.USER_ADMIN_NAME,
				password: process.env.USER_ADMIN_PASSWORD,
				phonenumber: "070433123",
				email: process.env.USER_ADMIN_EMAIL,
				enable: true,
				deletable: false,
				roles: [adminRoleFromDatabase._id as any],
			};

			const createdAdminUser: any = await this.userService.create(adminUser);
			this.logger.log(`User ${createdAdminUser.username} created successfully`);
		}

		// const existingAnynimus: any = await this.userService.checkUserNameExists("admin", undefined);
	}
}

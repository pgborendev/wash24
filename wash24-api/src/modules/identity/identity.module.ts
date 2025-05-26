import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { Role, RoleSchema } from "./schemas/role.schema";
import { RoleController } from "./controllers/role.controller";
import UserController from "./controllers/user.controller";
import { UserService } from "./services/user.service";
import { RoleService } from "./services/role.service";
import { ProfileController } from "./controllers/profile.controller";
import { ProfileService } from "./services/profile.service";
import { AuthModule } from "../auth/auth.module";
import { Profile, ProfileSchema } from './schemas/profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
    forwardRef(() => AuthModule), // Break circular dependency
  ],
  controllers: [UserController, RoleController, ProfileController],
  providers: [UserService, RoleService, ProfileService],
  exports: [UserService, RoleService, ProfileService],
})


export class IdentityModule {}

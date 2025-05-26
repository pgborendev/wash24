import { Controller, Inject, UseGuards } from '@nestjs/common';
import { BaseController } from "../../core/controllers/base.controller";
import { RoleService } from "../services/role.service";
import { BaseDto } from '../../core/dto/base.dto';
import { UserCreateDto } from '../../core/dto/user.dto';
import { Profile } from '../schemas/profile.schema';
import { ProfileService } from '../services/profile.service';


@Controller('/api/profiles')
class ProfileController extends BaseController<Profile> {

  constructor(@Inject(ProfileService) profileService: ProfileService) {
    super(profileService);
  }
 
}

export { ProfileController };

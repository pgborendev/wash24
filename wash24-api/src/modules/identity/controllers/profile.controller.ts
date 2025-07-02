import { Controller, Inject } from "@nestjs/common";
import { BaseController } from "../../core/controllers/base.controller";
import { Profile } from "../schemas/profile.schema";
import { ProfileService } from "../services/profile.service";

@Controller("/api/profiles")
class ProfileController extends BaseController<Profile> {
	constructor(@Inject(ProfileService) profileService: ProfileService) {
		super(profileService);
	}
}

export { ProfileController };

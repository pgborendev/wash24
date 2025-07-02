// user-create.dto.ts
import { BaseDto } from "./base.dto";

export class RefDocDto extends BaseDto {
	name: string;
	code: string;
	enable: boolean;
	deleted: boolean;
}

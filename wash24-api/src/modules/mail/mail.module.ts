import { Module } from "@nestjs/common";
import { MailService } from "./services/email.service";

@Module({
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}

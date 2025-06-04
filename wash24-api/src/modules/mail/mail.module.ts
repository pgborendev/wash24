import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MailService } from './services/email.service';

@Module({
  providers: [MailService],
  exports: [MailService],
})

export class MailModule {}

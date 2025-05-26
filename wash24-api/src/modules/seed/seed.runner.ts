import { NestFactory } from '@nestjs/core';

import { SeedService } from './seed.service';
import { AppModule } from '../../app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);
  await seedService.seedDefaultData();
  await app.close();
}

bootstrap();
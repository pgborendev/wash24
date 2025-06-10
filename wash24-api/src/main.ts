import * as express from 'express';
import cors from 'cors';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as https from 'https';
import { join } from 'path';
const path = require('path'); // Add this at top

async function bootstrap() {
  const port = process.env.API_PORT || 3000;
  
  // HTTPS configuration
  const httpsOptions = {
    key: fs.readFileSync('./key/key.pem'),
    cert: fs.readFileSync('./key/cert.pem')
  };

  const server = express();
  const app = await NestFactory.create(
    AppModule, new ExpressAdapter(server), { httpsOptions, cors: true }
  );

  // Enhanced CORS configuration
  app.enableCors({
    origin: [
      'https://localhost:3000', // Your Nuxt frontend
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : undefined // HTTP for dev
    ].filter(Boolean),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
  });

  const publicDir = join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Serve static files from the correct location
  app.use('/public', express.static(publicDir));

  await app.init();
  
  // Create HTTPS server
  https.createServer(httpsOptions, server)
    .listen(port, () => {
      console.log(`HTTPS Server running on port ${port}`);
    });
}

bootstrap();
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as https from 'https';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const port = process.env.API_PORT || 8080; // Changed to 8080 to match your API
  
  // HTTPS configuration
  const httpsOptions = {
    key: fs.readFileSync('./key/key.pem'),
    cert: fs.readFileSync('./key/cert.pem')
  };

  const server = express();
  
  // Apply CORS middleware at the Express level first
  server.use((req, res, next) => {
    const allowedOrigins = [
      'https://localhost:3000',
      'http://localhost:3000'
    ];
    
    const origin:any = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });

  const app = await NestFactory.create(
    AppModule, 
    new ExpressAdapter(server), 
    { httpsOptions }
  );

    app.use(cookieParser());

  
  app.enableCors({
    origin: [
      'https://localhost:3000',
      'http://localhost:3000'
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization'
  });

  const publicDir = join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  app.use('/public', express.static(publicDir));

  await app.init();
  
  https.createServer(httpsOptions, server)
    .listen(port, () => {
      console.log(`HTTPS Server running on port ${port}`);
    });
}

bootstrap();
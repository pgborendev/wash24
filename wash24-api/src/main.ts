import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as https from 'https';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import { networkInterfaces } from 'os';

async function bootstrap() {
  const port = process.env.API_PORT || 8080;
  
  // HTTPS configuration
  const httpsOptions = {
    key: fs.readFileSync('./key/key.pem'),
    cert: fs.readFileSync('./key/cert.pem')
  };

  const server = express();
  
  // Get local IP addresses for CORS
  const getLocalIPs = () => {
    const nets = networkInterfaces();
    const ips = ['localhost', '127.0.0.1'];
    Object.values(nets).forEach(net => {
      net?.forEach(({ family, internal, address }) => {
        if (family === 'IPv4' && !internal) ips.push(address);
      });
    });
    return ips;
  };

  const localIPs = getLocalIPs();
  const allowedOrigins = [
    'https://localhost:3000',
    'http://localhost:3000',
    ...localIPs.map(ip => `https://${ip}:3000`),
    ...localIPs.map(ip => `http://${ip}:3000`)
  ];

  // Apply CORS middleware at the Express level
  server.use((req, res, next) => {
    const origin = req.headers.origin as string;
    if (origin && allowedOrigins.some(allowed => origin.startsWith(allowed))) {
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
    origin: allowedOrigins,
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
  
  // Start server on all network interfaces
  https.createServer(httpsOptions, server)
  .listen({
    port: port,
    host: '0.0.0.0'
  }, () => {
    console.log(`HTTPS Server running on port ${port}`);
    console.log('Available on:');
    console.log(`- https://localhost:${port}`);
    localIPs.forEach(ip => {
      console.log(`- https://${ip}:${port}`);
    });
  });
}

bootstrap();
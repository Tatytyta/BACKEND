import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configurar carpeta de archivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Configurar validación global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  const port = process.env.PORT || 3001;
  
  // Configurar CORS muy permisivo
  const corsOrigins = process.env.NODE_ENV === 'production' 
    ? [
        process.env.CORS_ORIGIN || 'https://frontend-biblioteca.onrender.com',
        'https://frontend-biblioteca.onrender.com',
        'https://frontend-biblioteca44-kddsqboy3-damian-herreras-projects.vercel.app',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:3001',
      ]
    : true; // Permitir cualquier origen en desarrollo

  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200,
  });

  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Servidor escuchando en el puerto ${port}`);
  console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS habilitado para: ${JSON.stringify(corsOrigins)}`);
}
bootstrap();

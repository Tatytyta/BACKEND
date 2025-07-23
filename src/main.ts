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
  
  // Configurar CORS para producción y desarrollo
  const corsOrigins = process.env.NODE_ENV === 'production' 
    ? [
        process.env.CORS_ORIGIN || 'https://frontend-biblioteca.onrender.com',
        'https://frontend-biblioteca.onrender.com', // URL de tu frontend en Render
      ]
    : [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:3001',
      ];

  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Servidor escuchando en el puerto ${port}`);
  console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS habilitado para: ${JSON.stringify(corsOrigins)}`);
}
bootstrap();

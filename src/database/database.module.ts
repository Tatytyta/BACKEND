import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // PostgreSQL para datos relacionales
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: parseInt(configService.get('DB_PORT', '5432')),
        username: configService.get('DB_USER', configService.get('DB_USERNAME', 'postgres')),
        password: configService.get('DB_PASS', configService.get('DB_PASSWORD', 'password')),
        database: configService.get('DB_NAME', 'biblioteca'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV !== 'production', // Solo en desarrollo
        logging: process.env.NODE_ENV === 'development',
        ssl: process.env.NODE_ENV === 'production' ? {
          rejectUnauthorized: false,
        } : false,
        extra: process.env.NODE_ENV === 'production' ? {
          ssl: {
            rejectUnauthorized: false,
          }
        } : {},
      }),
    }),
    
    // MongoDB para datos no relacionales
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI', configService.get('MONGODB_URI', 'mongodb://localhost:27017/biblioteca')),
      }),
    }),
  ],
})
export class DatabaseModule {}

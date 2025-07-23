import { Controller, Get } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { InjectConnection } from '@nestjs/mongoose';
import { DataSource } from 'typeorm';
import { Connection } from 'mongoose';

@Controller('debug')
export class DebugController {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectConnection() private mongoConnection: Connection,
  ) {}

  @Get('health')
  async getHealth() {
    const health = {
      timestamp: new Date().toISOString(),
      status: 'ok',
      database: {
        postgres: {
          connected: false,
          error: null as string | null,
        },
        mongodb: {
          connected: false,
          error: null as string | null,
        }
      }
    };

    // Verificar PostgreSQL
    try {
      const result = await this.dataSource.query('SELECT 1');
      health.database.postgres.connected = true;
    } catch (error) {
      health.database.postgres.connected = false;
      health.database.postgres.error = error.message;
      health.status = 'error';
    }

    // Verificar MongoDB
    try {
      const mongoState = this.mongoConnection.readyState;
      health.database.mongodb.connected = mongoState === 1;
      if (mongoState !== 1) {
        health.database.mongodb.error = `Connection state: ${mongoState}`;
        health.status = 'error';
      }
    } catch (error) {
      health.database.mongodb.connected = false;
      health.database.mongodb.error = error.message;
      health.status = 'error';
    }

    return health;
  }

  @Get('env')
  getEnvironment() {
    return {
      NODE_ENV: process.env.NODE_ENV,
      DB_HOST: process.env.DB_HOST || 'Not set',
      DB_PORT: process.env.DB_PORT || 'Not set',
      DB_NAME: process.env.DB_NAME || 'Not set',
      DB_USER: process.env.DB_USER || process.env.DB_USERNAME || 'Not set',
      MONGO_URI: process.env.MONGO_URI || process.env.MONGODB_URI || 'Not set',
      hasDBPassword: !!process.env.DB_PASS || !!process.env.DB_PASSWORD,
    };
  }
}

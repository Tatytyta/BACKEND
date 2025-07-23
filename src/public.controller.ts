import { Controller, Get } from '@nestjs/common';

@Controller('public')
export class PublicController {

  @Get('health')
  getHealth() {
    return {
      timestamp: new Date().toISOString(),
      status: 'ok',
      message: 'API is running',
      version: '2025.07.13.10.31'
    };
  }

  @Get('test')
  getTest() {
    return {
      message: 'Endpoint público funcionando',
      data: {
        endpoints: ['/public/health', '/public/test', '/debug/health', '/debug/env'],
        note: 'Estos endpoints no requieren autenticación'
      }
    };
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { LibrosModule } from './libros/libros.module';
import { PrestamosModule } from './prestamos/prestamos.module';
import { GenerosModule } from './generos/generos.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    CommonModule,
    AuthModule,
    UsuariosModule,
    LibrosModule,
    PrestamosModule,
    GenerosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

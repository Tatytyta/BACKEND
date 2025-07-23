import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrosController } from './libros.controller';
import { LibrosService } from './libros.service';
import { Libro } from './libro.entity';
import { Genero } from '../generos/genero.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Libro, Genero])],
  controllers: [LibrosController],
  providers: [LibrosService],
  exports: [LibrosService],
})
export class LibrosModule {}

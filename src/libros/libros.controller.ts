import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LibrosService } from './libros.service';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'bibliotecario')
  create(@Body() createLibroDto: CreateLibroDto) {
    return this.librosService.create(createLibroDto);
  }

  @Get()
  findAll() {
    return this.librosService.findAll();
  }

  @Get('disponibles')
  findDisponibles() {
    return this.librosService.findDisponibles();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.librosService.search(query);
  }

  @Get('genero/:generoId')
  findByGenero(@Param('generoId') generoId: string) {
    return this.librosService.findByGenero(+generoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.librosService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'bibliotecario')
  update(@Param('id') id: string, @Body() updateLibroDto: UpdateLibroDto) {
    return this.librosService.update(+id, updateLibroDto);
  }

  @Patch(':id/disponibilidad')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'bibliotecario')
  updateDisponibilidad(@Param('id') id: string) {
    return this.librosService.updateDisponibilidad(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'bibliotecario')
  remove(@Param('id') id: string) {
    return this.librosService.remove(+id);
  }
}

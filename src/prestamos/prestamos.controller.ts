import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';
import { FiltroPrestamosDto } from './dto/filtro-prestamos.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('prestamos')
export class PrestamosController {
  constructor(private readonly prestamosService: PrestamosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'bibliotecario')
  create(@Body() createPrestamoDto: CreatePrestamoDto) {
    return this.prestamosService.create(createPrestamoDto);
  }

  @Get()
  findAll() {
    return this.prestamosService.findAll();
  }

  @Get('activos')
  findActivos() {
    return this.prestamosService.findActivos();
  }

  @Get('vencidos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'bibliotecario')
  findVencidos() {
    return this.prestamosService.findVencidos();
  }

  @Get('estadisticas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'bibliotecario')
  getEstadisticas() {
    return this.prestamosService.getEstadisticas();
  }

  @Get('usuario/:usuarioId')
  findByUsuario(@Param('usuarioId') usuarioId: string) {
    return this.prestamosService.findByUsuario(+usuarioId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prestamosService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'bibliotecario')
  update(@Param('id') id: string, @Body() updatePrestamoDto: UpdatePrestamoDto) {
    return this.prestamosService.update(+id, updatePrestamoDto);
  }

  @Patch(':id/devolver')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'bibliotecario')
  devolver(@Param('id') id: string) {
    return this.prestamosService.devolver(+id);
  }

  @Post('marcar-vencidos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'bibliotecario')
  marcarVencidos() {
    return this.prestamosService.marcarVencidos();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'bibliotecario')
  remove(@Param('id') id: string) {
    return this.prestamosService.remove(+id);
  }
}
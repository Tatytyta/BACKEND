import { IsOptional, IsString, IsEnum } from 'class-validator';
import { EstadoPrestamo } from '../prestamo.entity';

export class FiltroPrestamosDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(EstadoPrestamo)
  estado?: EstadoPrestamo;

  @IsOptional()
  @IsString()
  usuarioId?: string;

  @IsOptional()
  @IsString()
  libroId?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}

import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { CreatePrestamoDto } from './create-prestamo.dto';
import { EstadoPrestamo } from '../prestamo.entity';

export class UpdatePrestamoDto extends PartialType(CreatePrestamoDto) {
    @IsEnum(EstadoPrestamo)
    @IsOptional()
    estado?: EstadoPrestamo;

    @IsDateString()
    @IsOptional()
    fechaFin?: Date;
}

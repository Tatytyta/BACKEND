import { IsNumber, IsDateString, IsPositive } from 'class-validator';

export class CreatePrestamoDto {
    @IsNumber()
    @IsPositive()
    usuarioId: number;

    @IsNumber()
    @IsPositive()
    libroId: number;

    @IsDateString()
    fechaVencimiento: Date;
}

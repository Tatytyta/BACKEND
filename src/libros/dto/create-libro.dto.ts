import { IsString, IsNumber, IsOptional, IsISBN, IsDateString, IsPositive, Length } from 'class-validator';

export class CreateLibroDto {
    @IsString()
    @Length(1, 255)
    titulo: string;

    @IsString()
    @Length(1, 255)
    autor: string;

    @IsString()
    @IsISBN()
    ISBN: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    generoId?: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    ejemplaresDisponibles?: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    ejemplaresTotales?: number;

    @IsDateString()
    @IsOptional()
    fechaPublicacion?: Date;

    @IsString()
    @IsOptional()
    @Length(0, 1000)
    descripcion?: string;
}
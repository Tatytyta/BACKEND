import { IsOptional, IsString, IsBoolean, IsEnum } from 'class-validator';

export class FiltroLibrosDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  generoId?: string;

  @IsOptional()
  @IsBoolean()
  disponible?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}

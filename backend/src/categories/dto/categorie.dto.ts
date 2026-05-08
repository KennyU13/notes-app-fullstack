import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsHexColor, IsOptional, IsString, MinLength } from 'class-validator';

export class CreerCategorieDto {
  @ApiProperty()
  @IsString()
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caracteres' })
  nom: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsHexColor({ message: 'La couleur doit etre au format hexadecimal' })
  couleur?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  icone?: string;
}

export class ModifierCategorieDto extends PartialType(CreerCategorieDto) {}

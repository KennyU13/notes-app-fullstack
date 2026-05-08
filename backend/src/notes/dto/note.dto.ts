import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsHexColor, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreerNoteDto {
  @ApiProperty()
  @IsString()
  @MinLength(1, { message: 'Le titre est obligatoire' })
  titre: string;

  @ApiProperty()
  @IsString()
  contenu: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsHexColor({ message: 'La couleur doit etre au format hexadecimal' })
  couleur?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categorieId?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class ModifierNoteDto extends PartialType(CreerNoteDto) {}

export class RechercherNotesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limite = 12;

  @IsOptional()
  @IsString()
  categorieId?: string;

  @IsOptional()
  @IsString()
  tagId?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  favoris?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  archivees?: boolean;

  @IsOptional()
  @IsString()
  recherche?: string;
}

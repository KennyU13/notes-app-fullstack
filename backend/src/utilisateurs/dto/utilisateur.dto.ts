import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ModifierProfilDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Adresse email invalide' })
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Le prenom est obligatoire' })
  prenom?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Le nom est obligatoire' })
  nom?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString({}, { message: 'La date de naissance est invalide' })
  dateNaissance?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(120, { message: 'Le lieu de naissance ne doit pas depasser 120 caracteres' })
  lieuNaissance?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(120, { message: 'Le poste ne doit pas depasser 120 caracteres' })
  poste?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(40, { message: 'Le CIN ne doit pas depasser 40 caracteres' })
  cin?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(220, { message: "L'accroche ne doit pas depasser 220 caracteres" })
  accroche?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Les atouts ne doivent pas depasser 500 caracteres' })
  atouts?: string | null;
}

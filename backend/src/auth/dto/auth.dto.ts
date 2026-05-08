import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class InscriptionDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Adresse email invalide' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'Le mot de passe est obligatoire' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caracteres' })
  motDePasse: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Le prenom est obligatoire' })
  prenom: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  nom: string;
}

export class ConnexionDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Adresse email invalide' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  motDePasse: string;
}

export class RafraichirTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Le refresh token est obligatoire' })
  refreshToken: string;
}

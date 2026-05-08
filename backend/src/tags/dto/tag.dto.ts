import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreerTagDto {
  @ApiProperty()
  @IsString()
  @MinLength(2, { message: 'Le nom du tag doit contenir au moins 2 caracteres' })
  nom: string;
}

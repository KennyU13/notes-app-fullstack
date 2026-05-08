import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class ModifierProfilDto {
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
}

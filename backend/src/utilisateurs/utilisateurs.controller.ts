import { Body, Controller, Get, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UtilisateurCourant, UtilisateurJwt } from '../commun/decorateurs/utilisateur-courant';
import { JwtAuthGuard } from '../commun/gardes/jwt-auth.guard';
import { ModifierProfilDto } from './dto/utilisateur.dto';
import { UtilisateursService } from './utilisateurs.service';

@ApiTags('Utilisateurs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('utilisateurs')
export class UtilisateursController {
  constructor(private readonly utilisateurs: UtilisateursService) {}

  @Get('profil')
  profil(@UtilisateurCourant() utilisateur: UtilisateurJwt) {
    return this.utilisateurs.profil(utilisateur.id);
  }

  @Patch('profil')
  modifierProfil(@UtilisateurCourant() utilisateur: UtilisateurJwt, @Body() dto: ModifierProfilDto) {
    return this.utilisateurs.modifierProfil(utilisateur.id, dto);
  }

  @Post('profil/photo')
  @UseInterceptors(FileInterceptor('photo'))
  modifierPhoto(@UtilisateurCourant() utilisateur: UtilisateurJwt, @UploadedFile() photo: any) {
    return this.utilisateurs.modifierPhoto(utilisateur.id, photo);
  }
}

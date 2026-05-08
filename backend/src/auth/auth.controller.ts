import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UtilisateurCourant, UtilisateurJwt } from '../commun/decorateurs/utilisateur-courant';
import { JwtAuthGuard } from '../commun/gardes/jwt-auth.guard';
import { AuthService } from './auth.service';
import { ConnexionDto, InscriptionDto, RafraichirTokenDto } from './dto/auth.dto';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('inscription')
  inscription(@Body() dto: InscriptionDto) {
    return this.auth.inscription(dto);
  }

  @Post('connexion')
  connexion(@Body() dto: ConnexionDto) {
    return this.auth.connexion(dto);
  }

  @Post('rafraichir-token')
  rafraichirToken(@Body() dto: RafraichirTokenDto) {
    return this.auth.rafraichirToken(dto.refreshToken);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('deconnexion')
  deconnexion(@UtilisateurCourant() utilisateur: UtilisateurJwt) {
    return this.auth.deconnexion(utilisateur.id);
  }
}

import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
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
  connexion(@Body() dto: ConnexionDto, @Req() requete: Request) {
    return this.auth.connexion(dto, this.contexte(requete));
  }

  @Post('rafraichir-token')
  rafraichirToken(@Body() dto: RafraichirTokenDto, @Req() requete: Request) {
    return this.auth.rafraichirToken(dto.refreshToken, this.contexte(requete));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('deconnexion')
  deconnexion(@UtilisateurCourant() utilisateur: UtilisateurJwt, @Req() requete: Request) {
    return this.auth.deconnexion(utilisateur.id, this.contexte(requete));
  }

  private contexte(requete: Request) {
    return { ip: requete.ip, userAgent: requete.get('user-agent') };
  }
}

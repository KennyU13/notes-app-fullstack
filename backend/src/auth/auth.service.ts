import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { StringValue } from 'ms';
import { PrismaService } from '../prisma/prisma.service';
import { ConnexionDto, InscriptionDto } from './dto/auth.dto';

type UtilisateurSession = {
  id: string;
  email: string;
  motDePasse: string;
  prenom: string;
  nom: string;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async inscription(dto: InscriptionDto) {
    const existe = await this.prisma.utilisateur.findUnique({ where: { email: dto.email } });
    if (existe) throw new BadRequestException('Cet email est deja utilise');

    const utilisateur = await this.prisma.utilisateur.create({
      data: { ...dto, motDePasse: await bcrypt.hash(dto.motDePasse, 12) }
    });
    return this.creerSession(utilisateur);
  }

  async connexion(dto: ConnexionDto) {
    const utilisateur = await this.prisma.utilisateur.findUnique({ where: { email: dto.email } });
    if (!utilisateur || !(await bcrypt.compare(dto.motDePasse, utilisateur.motDePasse))) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    return this.creerSession(utilisateur);
  }

  async rafraichirToken(refreshToken: string) {
    const utilisateur = await this.prisma.utilisateur.findFirst({ where: { refreshToken } });
    if (!utilisateur) throw new UnauthorizedException('Refresh token invalide');
    return this.creerSession(utilisateur);
  }

  async deconnexion(utilisateurId: string) {
    await this.prisma.utilisateur.update({ where: { id: utilisateurId }, data: { refreshToken: null } });
    return { message: 'Deconnexion reussie' };
  }

  private async creerSession(utilisateur: UtilisateurSession) {
    const accessToken = await this.jwt.signAsync({ sub: utilisateur.id, email: utilisateur.email });
    const refreshToken = await this.jwt.signAsync(
      { sub: utilisateur.id, type: 'refresh' },
      { expiresIn: (this.config.get<string>('JWT_REFRESH_EXPIRATION') ?? '7d') as StringValue }
    );
    await this.prisma.utilisateur.update({ where: { id: utilisateur.id }, data: { refreshToken } });
    const { motDePasse: _motDePasse, refreshToken: _refresh, ...profil } = utilisateur;
    return { utilisateur: profil, accessToken, refreshToken };
  }
}

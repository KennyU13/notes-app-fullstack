import { ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { StringValue } from 'ms';
import { PrismaService } from '../prisma/prisma.service';
import { ConnexionDto, InscriptionDto } from './dto/auth.dto';

type ContexteAudit = { ip?: string; userAgent?: string };
type UtilisateurSession = {
  id: string;
  email: string;
  motDePasse: string;
  prenom: string;
  nom: string;
  photoProfil: string | null;
  dateNaissance: Date | null;
  lieuNaissance: string | null;
  poste: string | null;
  cin: string | null;
  accroche: string | null;
  atouts: string | null;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class AuthService {
  private readonly tentativesConnexion = new Map<string, { total: number; resetAt: number }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async inscription(dto: InscriptionDto) {
    const email = dto.email.trim().toLowerCase();
    const existe = await this.prisma.utilisateur.findUnique({ where: { email } });
    if (existe) throw new ConflictException('Cet email est deja utilise');

    const utilisateur = await this.prisma.utilisateur.create({
      data: { ...dto, email, motDePasse: await bcrypt.hash(dto.motDePasse, 12) }
    });
    await this.journaliser('inscription', { utilisateurId: utilisateur.id, email, succes: true });
    return this.creerSession(utilisateur);
  }

  async connexion(dto: ConnexionDto, contexte?: ContexteAudit) {
    const email = dto.email.trim().toLowerCase();
    this.verifierRateLimit(email, contexte?.ip);
    const utilisateur = await this.prisma.utilisateur.findUnique({ where: { email } });
    if (!utilisateur || !(await bcrypt.compare(dto.motDePasse, utilisateur.motDePasse))) {
      this.enregistrerEchec(email, contexte?.ip);
      await this.journaliser('connexion_echec', { email, succes: false, ...contexte });
      throw new UnauthorizedException('Identifiants invalides');
    }
    this.reinitialiserTentatives(email, contexte?.ip);
    await this.journaliser('connexion_reussie', { utilisateurId: utilisateur.id, email, succes: true, ...contexte });
    return this.creerSession(utilisateur);
  }

  async rafraichirToken(refreshToken: string, contexte?: ContexteAudit) {
    let payload: { sub: string; type?: string };
    try {
      payload = await this.jwt.verifyAsync(refreshToken, { secret: this.config.get<string>('JWT_SECRET') ?? 'secret-local' });
    } catch {
      throw new UnauthorizedException('Refresh token invalide ou expire');
    }
    if (payload.type !== 'refresh') throw new UnauthorizedException('Refresh token invalide');

    const utilisateur = await this.prisma.utilisateur.findUnique({ where: { id: payload.sub } });
    if (!utilisateur?.refreshToken || !(await bcrypt.compare(refreshToken, utilisateur.refreshToken))) {
      await this.journaliser('refresh_token_echec', { utilisateurId: payload.sub, succes: false, ...contexte });
      throw new UnauthorizedException('Refresh token invalide');
    }
    await this.journaliser('refresh_token_reussi', { utilisateurId: utilisateur.id, email: utilisateur.email, succes: true, ...contexte });
    return this.creerSession(utilisateur);
  }

  async deconnexion(utilisateurId: string, contexte?: ContexteAudit) {
    await this.prisma.utilisateur.update({ where: { id: utilisateurId }, data: { refreshToken: null } });
    await this.journaliser('deconnexion', { utilisateurId, succes: true, ...contexte });
    return { message: 'Deconnexion reussie' };
  }

  private async creerSession(utilisateur: UtilisateurSession) {
    const accessToken = await this.jwt.signAsync({ sub: utilisateur.id, email: utilisateur.email });
    const refreshToken = await this.jwt.signAsync(
      { sub: utilisateur.id, type: 'refresh' },
      { expiresIn: (this.config.get<string>('JWT_REFRESH_EXPIRATION') ?? '7d') as StringValue }
    );
    await this.prisma.utilisateur.update({ where: { id: utilisateur.id }, data: { refreshToken: await bcrypt.hash(refreshToken, 12) } });
    const { motDePasse: _motDePasse, refreshToken: _refresh, ...profil } = utilisateur;
    return { utilisateur: profil, accessToken, refreshToken };
  }

  private cleTentative(email: string, ip?: string) {
    return `${email}:${ip ?? 'ip-inconnue'}`;
  }

  private verifierRateLimit(email: string, ip?: string) {
    const tentative = this.tentativesConnexion.get(this.cleTentative(email, ip));
    if (tentative && tentative.total >= 5 && tentative.resetAt > Date.now()) {
      throw new HttpException('Trop de tentatives de connexion. Reessayez dans une minute', HttpStatus.TOO_MANY_REQUESTS);
    }
  }

  private enregistrerEchec(email: string, ip?: string) {
    const cle = this.cleTentative(email, ip);
    const actuelle = this.tentativesConnexion.get(cle);
    if (!actuelle || actuelle.resetAt <= Date.now()) {
      this.tentativesConnexion.set(cle, { total: 1, resetAt: Date.now() + 60_000 });
      return;
    }
    this.tentativesConnexion.set(cle, { ...actuelle, total: actuelle.total + 1 });
  }

  private reinitialiserTentatives(email: string, ip?: string) {
    this.tentativesConnexion.delete(this.cleTentative(email, ip));
  }

  private async journaliser(action: string, donnees: { utilisateurId?: string; email?: string; ip?: string; userAgent?: string; succes: boolean }) {
    await this.prisma.auditLog.create({ data: { action, ...donnees } }).catch(() => undefined);
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ModifierProfilDto } from './dto/utilisateur.dto';

@Injectable()
export class UtilisateursService {
  constructor(private readonly prisma: PrismaService) {}

  async profil(utilisateurId: string) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      select: { id: true, email: true, prenom: true, nom: true, photoProfil: true, createdAt: true, updatedAt: true }
    });
    if (!utilisateur) throw new NotFoundException('Utilisateur introuvable');
    return utilisateur;
  }

  async modifierProfil(utilisateurId: string, dto: ModifierProfilDto) {
    return this.prisma.utilisateur.update({
      where: { id: utilisateurId },
      data: {
        ...(dto.prenom !== undefined ? { prenom: dto.prenom.trim() } : {}),
        ...(dto.nom !== undefined ? { nom: dto.nom.trim() } : {})
      },
      select: { id: true, email: true, prenom: true, nom: true, photoProfil: true, createdAt: true, updatedAt: true }
    });
  }

  async modifierPhoto(utilisateurId: string, fichier?: { mimetype: string; size: number; buffer: Buffer }) {
    if (!fichier) throw new BadRequestException('Image de profil introuvable');
    if (!fichier.mimetype.startsWith('image/')) throw new BadRequestException('Le fichier doit etre une image');
    if (fichier.size > 2 * 1024 * 1024) throw new BadRequestException('La photo ne doit pas depasser 2 Mo');
    const photoProfil = `data:${fichier.mimetype};base64,${fichier.buffer.toString('base64')}`;
    return this.prisma.utilisateur.update({
      where: { id: utilisateurId },
      data: { photoProfil },
      select: { id: true, email: true, prenom: true, nom: true, photoProfil: true, createdAt: true, updatedAt: true }
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UtilisateursService {
  constructor(private readonly prisma: PrismaService) {}

  async profil(utilisateurId: string) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      select: { id: true, email: true, prenom: true, nom: true, createdAt: true, updatedAt: true }
    });
    if (!utilisateur) throw new NotFoundException('Utilisateur introuvable');
    return utilisateur;
  }
}

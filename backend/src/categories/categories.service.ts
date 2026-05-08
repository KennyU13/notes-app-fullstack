import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreerCategorieDto, ModifierCategorieDto } from './dto/categorie.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  lister(utilisateurId: string) {
    return this.prisma.categorie.findMany({ where: { utilisateurId }, orderBy: { createdAt: 'desc' } });
  }

  async creer(utilisateurId: string, dto: CreerCategorieDto) {
    try {
      return await this.prisma.categorie.create({ data: { utilisateurId, ...dto, nom: dto.nom.trim() } });
    } catch (erreur) {
      if (erreur instanceof Prisma.PrismaClientKnownRequestError && erreur.code === 'P2002') {
        throw new BadRequestException('Une categorie avec ce nom existe deja');
      }
      throw erreur;
    }
  }

  async modifier(utilisateurId: string, id: string, dto: ModifierCategorieDto) {
    await this.verifierProprietaire(utilisateurId, id);
    try {
      return await this.prisma.categorie.update({ where: { id }, data: { ...dto, nom: dto.nom?.trim() } });
    } catch (erreur) {
      if (erreur instanceof Prisma.PrismaClientKnownRequestError && erreur.code === 'P2002') {
        throw new BadRequestException('Une categorie avec ce nom existe deja');
      }
      throw erreur;
    }
  }

  async supprimer(utilisateurId: string, id: string) {
    await this.verifierProprietaire(utilisateurId, id);
    await this.prisma.categorie.delete({ where: { id } });
    return { id };
  }

  private async verifierProprietaire(utilisateurId: string, id: string) {
    const categorie = await this.prisma.categorie.findFirst({ where: { id, utilisateurId } });
    if (!categorie) throw new NotFoundException('Categorie introuvable');
  }
}

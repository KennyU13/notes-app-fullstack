import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
      return await this.prisma.categorie.create({ data: { utilisateurId, ...dto } });
    } catch {
      throw new BadRequestException('Une categorie avec ce nom existe deja');
    }
  }

  async modifier(utilisateurId: string, id: string, dto: ModifierCategorieDto) {
    await this.verifierProprietaire(utilisateurId, id);
    return this.prisma.categorie.update({ where: { id }, data: dto });
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

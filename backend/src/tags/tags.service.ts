import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreerTagDto } from './dto/tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  lister(utilisateurId: string) {
    return this.prisma.tag.findMany({ where: { utilisateurId }, orderBy: { nom: 'asc' } });
  }

  async creer(utilisateurId: string, dto: CreerTagDto) {
    try {
      return await this.prisma.tag.create({ data: { utilisateurId, nom: dto.nom.trim().toLowerCase() } });
    } catch {
      throw new BadRequestException('Ce tag existe deja');
    }
  }

  async supprimer(utilisateurId: string, id: string) {
    const tag = await this.prisma.tag.findFirst({ where: { id, utilisateurId } });
    if (!tag) throw new NotFoundException('Tag introuvable');
    await this.prisma.tag.delete({ where: { id } });
    return { id };
  }
}

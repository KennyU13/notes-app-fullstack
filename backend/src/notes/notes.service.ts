import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreerNoteDto, ModifierNoteDto, RechercherNotesDto } from './dto/note.dto';

const inclusionNote = {
  categorie: true,
  tags: { include: { tag: true } }
} satisfies Prisma.NoteInclude;

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async lister(utilisateurId: string, filtre: RechercherNotesDto) {
    const page = filtre.page ?? 1;
    const limite = filtre.limite ?? 12;
    const where: Prisma.NoteWhereInput = {
      utilisateurId,
      ...(filtre.categorieId ? { categorieId: filtre.categorieId } : {}),
      ...(filtre.favoris !== undefined ? { estFavorite: filtre.favoris } : {}),
      ...(filtre.archivees !== undefined ? { estArchivee: filtre.archivees } : {}),
      ...(filtre.tagId ? { tags: { some: { tagId: filtre.tagId } } } : {}),
      ...(filtre.recherche
        ? { OR: [{ titre: { contains: filtre.recherche, mode: 'insensitive' } }, { contenu: { contains: filtre.recherche, mode: 'insensitive' } }] }
        : {})
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.note.findMany({ where, include: inclusionNote, orderBy: { updatedAt: 'desc' }, skip: (page - 1) * limite, take: limite }),
      this.prisma.note.count({ where })
    ]);
    return { items, pagination: { page, limite, total, pages: Math.ceil(total / limite) } };
  }

  async creer(utilisateurId: string, dto: CreerNoteDto) {
    await this.verifierCategorie(utilisateurId, dto.categorieId);
    const tags = await this.preparerTags(utilisateurId, dto.tags);
    return this.prisma.note.create({
      data: {
        titre: dto.titre,
        contenu: dto.contenu,
        couleur: dto.couleur,
        categorieId: dto.categorieId,
        utilisateurId,
        tags: { create: tags.map((tag) => ({ tagId: tag.id })) }
      },
      include: inclusionNote
    });
  }

  async obtenir(utilisateurId: string, id: string) {
    const note = await this.prisma.note.findFirst({ where: { id, utilisateurId }, include: inclusionNote });
    if (!note) throw new NotFoundException('Note introuvable');
    return note;
  }

  async modifier(utilisateurId: string, id: string, dto: ModifierNoteDto) {
    await this.obtenir(utilisateurId, id);
    await this.verifierCategorie(utilisateurId, dto.categorieId);
    const tags = dto.tags ? await this.preparerTags(utilisateurId, dto.tags) : undefined;
    return this.prisma.note.update({
      where: { id },
      data: {
        titre: dto.titre,
        contenu: dto.contenu,
        couleur: dto.couleur,
        categorieId: dto.categorieId,
        ...(tags ? { tags: { deleteMany: {}, create: tags.map((tag) => ({ tagId: tag.id })) } } : {})
      },
      include: inclusionNote
    });
  }

  async supprimer(utilisateurId: string, id: string) {
    await this.obtenir(utilisateurId, id);
    await this.prisma.note.delete({ where: { id } });
    return { id };
  }

  async basculerFavori(utilisateurId: string, id: string) {
    const note = await this.obtenir(utilisateurId, id);
    return this.prisma.note.update({ where: { id }, data: { estFavorite: !note.estFavorite }, include: inclusionNote });
  }

  async basculerArchive(utilisateurId: string, id: string) {
    const note = await this.obtenir(utilisateurId, id);
    return this.prisma.note.update({ where: { id }, data: { estArchivee: !note.estArchivee }, include: inclusionNote });
  }

  private async verifierCategorie(utilisateurId: string, categorieId?: string) {
    if (!categorieId) return;
    const categorie = await this.prisma.categorie.findFirst({ where: { id: categorieId, utilisateurId } });
    if (!categorie) throw new BadRequestException('Categorie invalide');
  }

  private async preparerTags(utilisateurId: string, noms?: string[]) {
    if (!noms?.length) return [];
    const uniques = [...new Set(noms.map((nom) => nom.trim().toLowerCase()).filter(Boolean))];
    return Promise.all(
      uniques.map((nom) =>
        this.prisma.tag.upsert({
          where: { nom_utilisateurId: { nom, utilisateurId } },
          update: {},
          create: { nom, utilisateurId }
        })
      )
    );
  }
}

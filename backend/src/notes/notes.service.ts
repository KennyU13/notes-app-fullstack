import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { CreerNoteDto, ModifierNoteDto, RechercherNotesDto } from './dto/note.dto';

const inclusionNote = {
  categorie: true,
  tags: { include: { tag: true } },
  piecesJointes: true
} satisfies Prisma.NoteInclude;

const dossierUploads = join(process.cwd(), 'uploads', 'notes');

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async lister(utilisateurId: string, filtre: RechercherNotesDto) {
    const page = filtre.page ?? 1;
    const limite = filtre.limite ?? 12;
    const where: Prisma.NoteWhereInput = {
      utilisateurId,
      estSupprimee: filtre.corbeille === true,
      ...(filtre.categorieId ? { categorieId: filtre.categorieId } : {}),
      ...(filtre.favoris !== undefined ? { estFavorite: filtre.favoris } : {}),
      ...(filtre.archivees !== undefined ? { estArchivee: filtre.archivees } : {}),
      ...(filtre.epinglees !== undefined ? { estEpinglee: filtre.epinglees } : {}),
      ...(filtre.tagId ? { tags: { some: { tagId: filtre.tagId } } } : {}),
      ...(filtre.recherche
        ? { OR: [{ titre: { contains: filtre.recherche, mode: 'insensitive' } }, { contenu: { contains: filtre.recherche, mode: 'insensitive' } }] }
        : {})
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.note.findMany({ where, include: inclusionNote, orderBy: [{ estEpinglee: 'desc' }, { updatedAt: 'desc' }], skip: (page - 1) * limite, take: limite }),
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
        categorieId: dto.categorieId ?? null,
        utilisateurId,
        tags: { create: tags.map((tag) => ({ tagId: tag.id })) }
      },
      include: inclusionNote
    });
  }

  async obtenir(utilisateurId: string, id: string, inclureCorbeille = false) {
    const note = await this.prisma.note.findFirst({ where: { id, utilisateurId, ...(inclureCorbeille ? {} : { estSupprimee: false }) }, include: inclusionNote });
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
        ...(dto.categorieId !== undefined ? { categorieId: dto.categorieId } : {}),
        ...(tags ? { tags: { deleteMany: {}, create: tags.map((tag) => ({ tagId: tag.id })) } } : {})
      },
      include: inclusionNote
    });
  }

  async supprimer(utilisateurId: string, id: string) {
    await this.obtenir(utilisateurId, id);
    await this.prisma.note.update({ where: { id }, data: { estSupprimee: true, supprimeeAt: new Date(), estEpinglee: false } });
    return { id };
  }

  async restaurer(utilisateurId: string, id: string) {
    await this.obtenir(utilisateurId, id, true);
    return this.prisma.note.update({ where: { id }, data: { estSupprimee: false, supprimeeAt: null }, include: inclusionNote });
  }

  async supprimerDefinitivement(utilisateurId: string, id: string) {
    const note = await this.obtenir(utilisateurId, id, true);
    await Promise.all(note.piecesJointes.map((piece) => this.supprimerFichier(piece.chemin)));
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

  async basculerEpingle(utilisateurId: string, id: string) {
    const note = await this.obtenir(utilisateurId, id);
    return this.prisma.note.update({ where: { id }, data: { estEpinglee: !note.estEpinglee }, include: inclusionNote });
  }

  async ajouterPieceJointe(utilisateurId: string, noteId: string, fichier?: { originalname: string; mimetype: string; size: number; buffer: Buffer }) {
    if (!fichier) throw new BadRequestException('Aucun fichier envoye');
    if (fichier.size > 5 * 1024 * 1024) throw new BadRequestException('Le fichier ne doit pas depasser 5 Mo');
    await this.obtenir(utilisateurId, noteId);
    await mkdir(dossierUploads, { recursive: true });
    const extension = fichier.originalname.includes('.') ? fichier.originalname.split('.').pop() : 'bin';
    const nomFichier = `${randomUUID()}.${extension}`;
    const chemin = join(dossierUploads, nomFichier);
    await writeFile(chemin, fichier.buffer);
    return this.prisma.pieceJointe.create({
      data: { noteId, nomOriginal: fichier.originalname, nomFichier, typeMime: fichier.mimetype, taille: fichier.size, chemin }
    });
  }

  async supprimerPieceJointe(utilisateurId: string, pieceId: string) {
    const piece = await this.prisma.pieceJointe.findFirst({ where: { id: pieceId, note: { utilisateurId } } });
    if (!piece) throw new NotFoundException('Piece jointe introuvable');
    await this.supprimerFichier(piece.chemin);
    await this.prisma.pieceJointe.delete({ where: { id: pieceId } });
    return { id: pieceId };
  }

  async exporter(utilisateurId: string, format: 'json' | 'markdown' | 'pdf') {
    if (!['json', 'markdown', 'pdf'].includes(format)) throw new BadRequestException('Format export invalide');
    const notes = await this.prisma.note.findMany({
      where: { utilisateurId, estSupprimee: false },
      include: inclusionNote,
      orderBy: [{ estEpinglee: 'desc' }, { updatedAt: 'desc' }]
    });
    if (format === 'json') return { contenu: JSON.stringify(notes, null, 2), typeMime: 'application/json', nomFichier: 'notes.json' };
    if (format === 'markdown') return { contenu: this.genererMarkdown(notes), typeMime: 'text/markdown; charset=utf-8', nomFichier: 'notes.md' };
    return { contenu: this.genererPdfSimple(this.genererMarkdown(notes)), typeMime: 'application/pdf', nomFichier: 'notes.pdf' };
  }

  private async verifierCategorie(utilisateurId: string, categorieId?: string | null) {
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

  private async supprimerFichier(chemin: string) {
    await unlink(chemin).catch(() => undefined);
  }

  private genererMarkdown(notes: Prisma.NoteGetPayload<{ include: typeof inclusionNote }>[]) {
    return notes
      .map((note) => {
        const tags = note.tags.map(({ tag }) => `#${tag.nom}`).join(' ');
        const pieces = note.piecesJointes.map((piece) => `- ${piece.nomOriginal}`).join('\n');
        return [`# ${note.titre}`, '', note.contenu, '', `Categorie: ${note.categorie?.nom ?? 'Sans categorie'}`, `Tags: ${tags || 'Aucun'}`, pieces ? `Pieces jointes:\n${pieces}` : '', ''].join('\n');
      })
      .join('\n---\n\n');
  }

  private genererPdfSimple(texte: string) {
    const lignes = texte.replace(/[()\\]/g, '').split('\n').slice(0, 120);
    const contenu = ['BT', '/F1 12 Tf', '50 790 Td', ...lignes.map((ligne, index) => `${index === 0 ? '' : '0 -16 Td'}(${ligne.slice(0, 95)}) Tj`), 'ET'].join('\n');
    const objets = [
      '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
      '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
      '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj',
      '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
      `5 0 obj << /Length ${Buffer.byteLength(contenu)} >> stream\n${contenu}\nendstream endobj`
    ];
    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    for (const objet of objets) {
      offsets.push(Buffer.byteLength(pdf));
      pdf += `${objet}\n`;
    }
    const xref = Buffer.byteLength(pdf);
    pdf += `xref\n0 ${objets.length + 1}\n0000000000 65535 f \n`;
    pdf += offsets.slice(1).map((offset) => `${offset.toString().padStart(10, '0')} 00000 n \n`).join('');
    pdf += `trailer << /Size ${objets.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    return Buffer.from(pdf, 'utf-8');
  }
}

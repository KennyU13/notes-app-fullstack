import { BadRequestException } from '@nestjs/common';
import { NotesService } from './notes.service';

describe('NotesService', () => {
  const prisma = {
    categorie: { findFirst: jest.fn() },
    tag: { upsert: jest.fn() },
    note: { create: jest.fn(), findFirst: jest.fn(), update: jest.fn() },
    $transaction: jest.fn()
  };

  let service: NotesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new NotesService(prisma as never);
  });

  it('refuse une categorie qui n appartient pas a l utilisateur', async () => {
    prisma.categorie.findFirst.mockResolvedValue(null);

    await expect(
      service.creer('utilisateur-1', {
        titre: 'Titre',
        contenu: 'Contenu',
        categorieId: 'categorie-autre'
      })
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('permet de retirer la categorie d une note', async () => {
    prisma.note.findFirst.mockResolvedValue({
      id: 'note-1',
      utilisateurId: 'utilisateur-1',
      titre: 'Titre',
      contenu: 'Contenu',
      estFavorite: false,
      estArchivee: false
    });
    prisma.note.update.mockResolvedValue({ id: 'note-1', categorieId: null });

    await service.modifier('utilisateur-1', 'note-1', { categorieId: null });

    expect(prisma.note.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ categorieId: null })
      })
    );
  });

  it('plafonne implicitement les tags en valeurs uniques et normalisees', async () => {
    prisma.categorie.findFirst.mockResolvedValue({ id: 'categorie-1' });
    prisma.tag.upsert.mockResolvedValueOnce({ id: 'tag-api', nom: 'api' });
    prisma.note.create.mockResolvedValue({ id: 'note-1' });

    await service.creer('utilisateur-1', {
      titre: 'Titre',
      contenu: 'Contenu',
      categorieId: 'categorie-1',
      tags: ['API', ' api ', '']
    });

    expect(prisma.tag.upsert).toHaveBeenCalledTimes(1);
    expect(prisma.tag.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { nom_utilisateurId: { nom: 'api', utilisateurId: 'utilisateur-1' } }
      })
    );
  });
});

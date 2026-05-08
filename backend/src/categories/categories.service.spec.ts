import { NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  const prisma = {
    categorie: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  };

  let service: CategoriesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CategoriesService(prisma as never);
  });

  it('liste uniquement les categories de l utilisateur courant', async () => {
    prisma.categorie.findMany.mockResolvedValue([]);

    await service.lister('utilisateur-1');

    expect(prisma.categorie.findMany).toHaveBeenCalledWith({
      where: { utilisateurId: 'utilisateur-1' },
      orderBy: { createdAt: 'desc' }
    });
  });

  it('nettoie le nom a la creation', async () => {
    prisma.categorie.create.mockResolvedValue({ id: 'categorie-1', nom: 'Travail' });

    await service.creer('utilisateur-1', { nom: ' Travail ', couleur: '#06b6d4' });

    expect(prisma.categorie.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ utilisateurId: 'utilisateur-1', nom: 'Travail' })
    });
  });

  it('refuse la suppression si la categorie n appartient pas a l utilisateur', async () => {
    prisma.categorie.findFirst.mockResolvedValue(null);

    await expect(service.supprimer('utilisateur-1', 'categorie-autre')).rejects.toBeInstanceOf(NotFoundException);
  });
});

import { NotFoundException } from '@nestjs/common';
import { TagsService } from './tags.service';

describe('TagsService', () => {
  const prisma = {
    tag: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn()
    }
  };

  let service: TagsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TagsService(prisma as never);
  });

  it('liste les tags par ordre alphabetique pour l utilisateur courant', async () => {
    prisma.tag.findMany.mockResolvedValue([]);

    await service.lister('utilisateur-1');

    expect(prisma.tag.findMany).toHaveBeenCalledWith({
      where: { utilisateurId: 'utilisateur-1' },
      orderBy: { nom: 'asc' }
    });
  });

  it('normalise le nom du tag a la creation', async () => {
    prisma.tag.create.mockResolvedValue({ id: 'tag-1', nom: 'api' });

    await service.creer('utilisateur-1', { nom: ' API ' });

    expect(prisma.tag.create).toHaveBeenCalledWith({
      data: { utilisateurId: 'utilisateur-1', nom: 'api' }
    });
  });

  it('refuse la suppression si le tag n appartient pas a l utilisateur', async () => {
    prisma.tag.findFirst.mockResolvedValue(null);

    await expect(service.supprimer('utilisateur-1', 'tag-autre')).rejects.toBeInstanceOf(NotFoundException);
  });
});

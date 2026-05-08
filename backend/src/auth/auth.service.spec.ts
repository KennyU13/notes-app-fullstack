import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const prisma = {
    utilisateur: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    }
  };
  const jwt = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn()
  };
  const config = {
    get: jest.fn()
  };

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    config.get.mockReturnValue('secret-test');
    service = new AuthService(prisma as never, jwt as never, config as never);
  });

  it('normalise l email a l inscription', async () => {
    prisma.utilisateur.findUnique.mockResolvedValue(null);
    prisma.utilisateur.create.mockImplementation(({ data }) => Promise.resolve({ id: 'u1', refreshToken: null, createdAt: new Date(), updatedAt: new Date(), ...data }));
    prisma.utilisateur.update.mockResolvedValue({});
    jwt.signAsync.mockResolvedValueOnce('access').mockResolvedValueOnce('refresh');

    await service.inscription({
      email: ' TEST@EXAMPLE.COM ',
      motDePasse: 'password123',
      prenom: 'Test',
      nom: 'User'
    });

    expect(prisma.utilisateur.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(prisma.utilisateur.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ email: 'test@example.com' })
      })
    );
  });

  it('rejette un refresh token invalide', async () => {
    jwt.verifyAsync.mockRejectedValue(new Error('expire'));

    await expect(service.rafraichirToken('token-invalide')).rejects.toBeInstanceOf(UnauthorizedException);
  });
});

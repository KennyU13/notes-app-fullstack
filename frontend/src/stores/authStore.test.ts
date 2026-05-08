import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from './authStore';

vi.mock('../services/auth', () => ({
  authService: {
    connexion: vi.fn(),
    inscription: vi.fn(),
    deconnexion: vi.fn()
  }
}));

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      utilisateur: null,
      token: null,
      refreshToken: null,
      estHydrate: false
    });
  });

  it('marque l hydratation comme terminee', () => {
    useAuthStore.getState().definirHydratation(true);
    expect(useAuthStore.getState().estHydrate).toBe(true);
  });

  it('stocke une session utilisateur', () => {
    useAuthStore.getState().definirSession({
      utilisateur: { id: 'u1', email: 'test@example.com', prenom: 'Test', nom: 'User' },
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    });

    expect(useAuthStore.getState().token).toBe('access-token');
    expect(useAuthStore.getState().refreshToken).toBe('refresh-token');
    expect(useAuthStore.getState().utilisateur?.email).toBe('test@example.com');
  });
});

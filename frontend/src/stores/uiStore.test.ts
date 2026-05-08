import { beforeEach, describe, expect, it } from 'vitest';
import { useUiStore } from './uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    useUiStore.setState({ theme: 'dark', vue: 'grille', sidebarOuverte: false });
  });

  it('bascule le theme entre sombre et clair', () => {
    useUiStore.getState().basculerTheme();
    expect(useUiStore.getState().theme).toBe('light');

    useUiStore.getState().basculerTheme();
    expect(useUiStore.getState().theme).toBe('dark');
  });

  it('change la vue des notes', () => {
    useUiStore.getState().definirVue('liste');
    expect(useUiStore.getState().vue).toBe('liste');
  });

  it('ouvre et ferme la sidebar', () => {
    useUiStore.getState().basculerSidebar();
    expect(useUiStore.getState().sidebarOuverte).toBe(true);
  });
});

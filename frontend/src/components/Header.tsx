import { IconLayoutSidebarLeftExpand, IconLogout, IconMoonStars, IconSun } from '@tabler/icons-react';
import { SearchBar } from './SearchBar';
import { useAuthStore } from '../stores/authStore';
import { useUiStore } from '../stores/uiStore';

export function Header() {
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const deconnexion = useAuthStore((s) => s.deconnexion);
  const theme = useUiStore((s) => s.theme);
  const basculerTheme = useUiStore((s) => s.basculerTheme);
  const basculerSidebar = useUiStore((s) => s.basculerSidebar);

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 bg-black/10 p-3 backdrop-blur-xl sm:p-4">
      <button className="rounded-2xl bg-white/10 p-3 lg:hidden" onClick={basculerSidebar}><IconLayoutSidebarLeftExpand /></button>
      <div className="order-3 w-full sm:order-none sm:min-w-64 sm:flex-1"><SearchBar /></div>
      <button title="Theme" onClick={basculerTheme} className="rounded-2xl bg-white/10 p-3">{theme === 'dark' ? <IconMoonStars /> : <IconSun />}</button>
      <div className="hidden items-center gap-3 rounded-2xl bg-white/10 px-3 py-2 sm:flex">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-cyan-400/40 font-bold">{utilisateur?.prenom?.[0]}</div>
        <span className="text-sm text-white/80">{utilisateur?.prenom}</span>
      </div>
      <button title="Deconnexion" onClick={() => void deconnexion()} className="rounded-2xl bg-white/10 p-3"><IconLogout /></button>
    </header>
  );
}

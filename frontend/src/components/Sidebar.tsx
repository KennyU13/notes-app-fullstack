import { IconArchive, IconCategory, IconHome, IconNote, IconPlus, IconStar, IconUser } from '@tabler/icons-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useNotesStore } from '../stores/notesStore';
import { useUiStore } from '../stores/uiStore';

const liens = [
  { to: '/', label: 'Tableau', Icone: IconHome },
  { to: '/notes', label: 'Notes', Icone: IconNote },
  { to: '/notes/favorites', label: 'Favoris', Icone: IconStar },
  { to: '/notes/archivees', label: 'Archivees', Icone: IconArchive },
  { to: '/categories', label: 'Categories', Icone: IconCategory },
  { to: '/profil', label: 'Profil', Icone: IconUser }
];

export function Sidebar() {
  const navigate = useNavigate();
  const notes = useNotesStore((s) => s.notes);
  const ouverte = useUiStore((s) => s.sidebarOuverte);
  const basculer = useUiStore((s) => s.basculerSidebar);
  const contenu = (
    <aside className="h-full w-72 rounded-r-[24px] bg-glass p-5 shadow-glass lg:rounded-[24px]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">Notes App</p>
          <p className="text-sm text-white/55">{notes.length} notes</p>
        </div>
      </div>
      <button onClick={() => navigate('/notes/nouvelle')} className="mb-6 flex w-full items-center justify-center gap-2 rounded-2xl bouton-glass px-4 py-3 font-semibold"><IconPlus size={20} /> Nouvelle note</button>
      <nav className="space-y-2">
        {liens.map(({ to, label, Icone }) => (
          <NavLink key={to} to={to} onClick={() => ouverte && basculer()} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm ${isActive ? 'bg-white/18 text-white' : 'text-white/70 hover:bg-white/10'}`}>
            <Icone size={20} /> {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
  return (
    <>
      <div className="hidden p-4 lg:block">{contenu}</div>
      {ouverte && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={basculer}><div className="h-full" onClick={(e) => e.stopPropagation()}>{contenu}</div></div>}
    </>
  );
}

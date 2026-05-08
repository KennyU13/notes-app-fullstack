import { IconArchive, IconCategory, IconHome, IconNote, IconPlus, IconStar, IconTrash, IconUser } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { notesService } from '../services/notes';
import { statistiquesService, StatistiquesGlobales } from '../services/statistiques';
import { useCategoriesStore } from '../stores/categoriesStore';
import { useNotesStore } from '../stores/notesStore';
import { useUiStore } from '../stores/uiStore';

const liens = [
  { to: '/', label: 'Tableau', Icone: IconHome, compteur: null },
  { to: '/notes', label: 'Notes', Icone: IconNote, compteur: 'notes' },
  { to: '/notes/favorites', label: 'Favoris', Icone: IconStar, compteur: 'favoris' },
  { to: '/notes/archivees', label: 'Archivees', Icone: IconArchive, compteur: 'archivees' },
  { to: '/notes/corbeille', label: 'Corbeille', Icone: IconTrash, compteur: 'corbeille' },
  { to: '/categories', label: 'Categories', Icone: IconCategory, compteur: 'categories' },
  { to: '/profil', label: 'Profil', Icone: IconUser, compteur: null }
] as const;

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const notes = useNotesStore((s) => s.notes);
  const definirFiltres = useNotesStore((s) => s.definirFiltres);
  const categories = useCategoriesStore((s) => s.categories);
  const chargerCategories = useCategoriesStore((s) => s.charger);
  const ouverte = useUiStore((s) => s.sidebarOuverte);
  const basculer = useUiStore((s) => s.basculerSidebar);
  const [totalNotes, setTotalNotes] = useState(0);
  const [stats, setStats] = useState<StatistiquesGlobales>({ notes: 0, favoris: 0, archivees: 0, corbeille: 0, categories: 0 });
  const [compteursCategories, setCompteursCategories] = useState<Record<string, number>>({});

  useEffect(() => {
    void chargerCategories();
  }, [chargerCategories]);

  useEffect(() => {
    void notesService.lister({ page: 1, limite: 1 }).then((reponse) => setTotalNotes(reponse.pagination.total));
    void statistiquesService.globales().then(setStats);
    void Promise.all(categories.map(async (categorie) => {
      const reponse = await notesService.lister({ page: 1, limite: 1, categorieId: categorie.id });
      return [categorie.id, reponse.pagination.total] as const;
    })).then((items) => setCompteursCategories(Object.fromEntries(items)));
  }, [notes.length, categories.length]);

  const ouvrirToutesLesNotes = () => {
    definirFiltres({ categorieId: undefined, favoris: undefined, archivees: undefined });
    navigate('/notes');
    if (ouverte) basculer();
  };

  const ouvrirCategorie = (categorieId: string) => {
    definirFiltres({ categorieId, favoris: undefined, archivees: undefined });
    navigate(`/categories/${categorieId}`);
    if (ouverte) basculer();
  };

  const contenu = (
    <aside className="h-full w-72 rounded-r-[24px] bg-glass p-5 shadow-glass lg:rounded-[24px]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">Notes App</p>
          <p className="text-sm text-white/55">{totalNotes} notes</p>
        </div>
      </div>
      <button onClick={() => navigate('/notes/nouvelle')} className="mb-6 flex w-full items-center justify-center gap-2 rounded-2xl bouton-glass px-4 py-3 font-semibold"><IconPlus size={20} /> Nouvelle note</button>
      <nav className="space-y-2">
        {liens.map(({ to, label, Icone, compteur }) => (
          <NavLink key={to} to={to} onClick={() => ouverte && basculer()} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm ${isActive ? 'bg-white/18 text-white' : 'text-white/70 hover:bg-white/10'}`}>
            <Icone size={20} />
            <span className="min-w-0 flex-1">{label}</span>
            {compteur && <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">{stats[compteur]}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="mt-8 min-h-0">
        <div className="mb-3 flex items-center justify-between px-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/45">Categories</p>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/55">{categories.length}</span>
        </div>
        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
          <button onClick={ouvrirToutesLesNotes} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm ${location.pathname === '/notes' && !location.search ? 'bg-white/18 text-white' : 'text-white/70 hover:bg-white/10'}`}>
            <span className="h-3 w-3 rounded-full bg-white/50" />
            <span className="min-w-0 flex-1">Toutes les notes</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{stats.notes}</span>
          </button>
          {categories.map((categorie) => (
            <button key={categorie.id} onClick={() => ouvrirCategorie(categorie.id)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm ${location.pathname === `/categories/${categorie.id}` ? 'bg-white/18 text-white' : 'text-white/70 hover:bg-white/10'}`}>
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: categorie.couleur }} />
              <span className="min-w-0 flex-1 truncate">{categorie.nom}</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{compteursCategories[categorie.id] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
  return (
    <>
      <div className="hidden p-4 lg:block">{contenu}</div>
      {ouverte && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={basculer}><div className="h-full" onClick={(e) => e.stopPropagation()}>{contenu}</div></div>}
    </>
  );
}

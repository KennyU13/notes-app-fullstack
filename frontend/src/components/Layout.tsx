import { NavLink, Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { IconCategory, IconHome, IconNote, IconPlus, IconUser } from '@tabler/icons-react';

const navigationMobile = [
  { to: '/', label: 'Tableau', Icone: IconHome },
  { to: '/notes', label: 'Notes', Icone: IconNote },
  { to: '/notes/nouvelle', label: 'Ajouter', Icone: IconPlus },
  { to: '/categories', label: 'Categories', Icone: IconCategory },
  { to: '/profil', label: 'Profil', Icone: IconUser }
];

export function Layout() {
  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <main className="min-w-0 flex-1 pb-20">
        <Header />
        <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-4 lg:px-6">
          <Outlet />
        </div>
      </main>
      <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 rounded-[24px] border border-white/15 bg-black/35 p-2 shadow-glass backdrop-blur-xl lg:hidden">
        {navigationMobile.map(({ to, label, Icone }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] ${isActive ? 'bg-white/18 text-white' : 'text-white/60'}`}>
            <Icone size={18} />
            <span className="max-w-full truncate">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

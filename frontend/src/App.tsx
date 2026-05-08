import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PrivateRoute } from './components/PrivateRoute';
import { AuthPage } from './pages/AuthPage';
import { CategorieDetailPage } from './pages/CategorieDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { DashboardPage } from './pages/DashboardPage';
import { NoteFormPage } from './pages/NoteFormPage';
import { NotesPage } from './pages/NotesPage';
import { ProfilPage } from './pages/ProfilPage';
import { useUiStore } from './stores/uiStore';

function Page({ children }: { children: React.ReactNode }) {
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>{children}</motion.div>;
}

export default function App() {
  const location = useLocation();
  const theme = useUiStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className={theme}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/connexion" element={<AuthPage />} />
          <Route path="/inscription" element={<AuthPage inscription />} />
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Page><DashboardPage /></Page>} />
              <Route path="notes" element={<Page><NotesPage /></Page>} />
              <Route path="notes/nouvelle" element={<Page><NoteFormPage /></Page>} />
              <Route path="notes/favorites" element={<Page><NotesPage favoris /></Page>} />
              <Route path="notes/archivees" element={<Page><NotesPage archivees /></Page>} />
              <Route path="notes/corbeille" element={<Page><NotesPage corbeille /></Page>} />
              <Route path="notes/:id" element={<Page><NoteFormPage /></Page>} />
              <Route path="categories" element={<Page><CategoriesPage /></Page>} />
              <Route path="categories/:id" element={<Page><CategorieDetailPage /></Page>} />
              <Route path="profil" element={<Page><ProfilPage /></Page>} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

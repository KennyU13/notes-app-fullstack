import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

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
    </div>
  );
}

import { Navigate, Outlet } from 'react-router-dom';
import { Loader } from './Loader';
import { useAuthStore } from '../stores/authStore';

export function PrivateRoute() {
  const token = useAuthStore((s) => s.token);
  const estHydrate = useAuthStore((s) => s.estHydrate);
  if (!estHydrate) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader />
      </div>
    );
  }
  return token ? <Outlet /> : <Navigate to="/connexion" replace />;
}

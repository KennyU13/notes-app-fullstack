import { useAuthStore } from '../stores/authStore';

export function ProfilPage() {
  const utilisateur = useAuthStore((s) => s.utilisateur);
  return (
    <div className="max-w-xl rounded-3xl bg-glass p-6 shadow-glass">
      <h1 className="text-3xl font-bold">Profil</h1>
      <div className="mt-6 space-y-3 text-white/75">
        <p>Prenom : {utilisateur?.prenom}</p>
        <p>Nom : {utilisateur?.nom}</p>
        <p>Email : {utilisateur?.email}</p>
      </div>
    </div>
  );
}

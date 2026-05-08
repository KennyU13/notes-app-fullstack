import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuthStore } from '../stores/authStore';

const schema = z.object({
  email: z.string().email('Email invalide'),
  motDePasse: z.string().min(8, '8 caracteres minimum'),
  prenom: z.string().optional(),
  nom: z.string().optional()
});

export function AuthPage({ inscription = false }: { inscription?: boolean }) {
  const navigate = useNavigate();
  const auth = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const soumettre = handleSubmit(async (valeurs) => {
    if (inscription) await auth.inscription({ email: valeurs.email, motDePasse: valeurs.motDePasse, prenom: valeurs.prenom ?? '', nom: valeurs.nom ?? '' });
    else await auth.connexion(valeurs.email, valeurs.motDePasse);
    navigate('/');
  });
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <form onSubmit={soumettre} className="w-full max-w-md rounded-[24px] bg-glass p-8 shadow-glass">
        <h1 className="text-3xl font-bold">{inscription ? 'Inscription' : 'Connexion'}</h1>
        <div className="mt-6 space-y-4">
          {inscription && <><input {...register('prenom')} placeholder="Prenom" className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3" /><input {...register('nom')} placeholder="Nom" className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3" /></>}
          <input {...register('email')} placeholder="Email" className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3" />
          <input {...register('motDePasse')} type="password" placeholder="Mot de passe" className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3" />
          <p className="text-sm text-rose-200">{String(errors.email?.message || errors.motDePasse?.message || '')}</p>
        </div>
        <button className="mt-6 w-full rounded-2xl bouton-glass px-5 py-3 font-semibold">{inscription ? 'Creer mon compte' : 'Me connecter'}</button>
        <Link className="mt-4 block text-center text-sm text-cyan-200" to={inscription ? '/connexion' : '/inscription'}>{inscription ? 'J ai deja un compte' : 'Creer un compte'}</Link>
      </form>
    </main>
  );
}

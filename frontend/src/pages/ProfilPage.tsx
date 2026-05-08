import { IconCamera, IconDeviceFloppy, IconMail, IconUser } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export function ProfilPage() {
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const modifierProfil = useAuthStore((s) => s.modifierProfil);
  const modifierPhoto = useAuthStore((s) => s.modifierPhoto);
  const [prenom, setPrenom] = useState(utilisateur?.prenom ?? '');
  const [nom, setNom] = useState(utilisateur?.nom ?? '');

  useEffect(() => {
    setPrenom(utilisateur?.prenom ?? '');
    setNom(utilisateur?.nom ?? '');
  }, [utilisateur]);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h1 className="text-3xl font-bold">Profil</h1>
        <p className="mt-2 text-sm text-white/60">Personnalisez vos informations et votre photo.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <section className="rounded-3xl bg-glass p-6 text-center shadow-glass">
          <div className="mx-auto grid h-32 w-32 place-items-center overflow-hidden rounded-[32px] border border-white/20 bg-white/10 shadow-glow">
            {utilisateur?.photoProfil ? <img src={utilisateur.photoProfil} alt="Photo de profil" className="h-full w-full object-cover" /> : <IconUser size={56} className="text-white/60" />}
          </div>
          <p className="mt-4 text-xl font-semibold">{utilisateur?.prenom} {utilisateur?.nom}</p>
          <p className="mt-1 flex items-center justify-center gap-2 text-sm text-white/60"><IconMail size={16} /> {utilisateur?.email}</p>
          <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-2xl bouton-glass px-4 py-3 text-sm font-semibold">
            <IconCamera size={18} /> Changer la photo
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const photo = e.target.files?.[0]; if (photo) void modifierPhoto(photo); }} />
          </label>
        </section>

        <form
          onSubmit={(e) => { e.preventDefault(); void modifierProfil({ prenom, nom }); }}
          className="rounded-3xl bg-glass p-6 shadow-glass"
        >
          <h2 className="text-xl font-semibold">Informations personnelles</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-white/65">
              Prenom
              <input value={prenom} onChange={(e) => setPrenom(e.target.value)} className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white" />
            </label>
            <label className="space-y-2 text-sm text-white/65">
              Nom
              <input value={nom} onChange={(e) => setNom(e.target.value)} className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white" />
            </label>
          </div>
          <button className="mt-6 inline-flex items-center gap-2 rounded-2xl bouton-glass px-5 py-3 font-semibold"><IconDeviceFloppy size={18} /> Enregistrer</button>
        </form>
      </div>
    </div>
  );
}

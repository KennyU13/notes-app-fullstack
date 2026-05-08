import { IconBriefcase, IconCamera, IconDeviceFloppy, IconFingerprint, IconMapPin, IconMail, IconSparkles, IconUser } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export function ProfilPage() {
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const modifierProfil = useAuthStore((s) => s.modifierProfil);
  const modifierPhoto = useAuthStore((s) => s.modifierPhoto);
  const [email, setEmail] = useState(utilisateur?.email ?? '');
  const [prenom, setPrenom] = useState(utilisateur?.prenom ?? '');
  const [nom, setNom] = useState(utilisateur?.nom ?? '');
  const [dateNaissance, setDateNaissance] = useState(utilisateur?.dateNaissance?.slice(0, 10) ?? '');
  const [lieuNaissance, setLieuNaissance] = useState(utilisateur?.lieuNaissance ?? '');
  const [poste, setPoste] = useState(utilisateur?.poste ?? '');
  const [cin, setCin] = useState(utilisateur?.cin ?? '');
  const [accroche, setAccroche] = useState(utilisateur?.accroche ?? '');
  const [atouts, setAtouts] = useState(utilisateur?.atouts ?? '');

  useEffect(() => {
    setEmail(utilisateur?.email ?? '');
    setPrenom(utilisateur?.prenom ?? '');
    setNom(utilisateur?.nom ?? '');
    setDateNaissance(utilisateur?.dateNaissance?.slice(0, 10) ?? '');
    setLieuNaissance(utilisateur?.lieuNaissance ?? '');
    setPoste(utilisateur?.poste ?? '');
    setCin(utilisateur?.cin ?? '');
    setAccroche(utilisateur?.accroche ?? '');
    setAtouts(utilisateur?.atouts ?? '');
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
          {utilisateur?.poste && <p className="mt-1 text-sm font-medium text-cyan-100">{utilisateur.poste}</p>}
          <p className="mt-1 flex items-center justify-center gap-2 text-sm text-white/60"><IconMail size={16} /> {utilisateur?.email}</p>
          {utilisateur?.accroche && <p className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm leading-6 text-white/75">{utilisateur.accroche}</p>}
          <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-2xl bouton-glass px-4 py-3 text-sm font-semibold">
            <IconCamera size={18} /> Changer la photo
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const photo = e.target.files?.[0]; if (photo) void modifierPhoto(photo); }} />
          </label>
          <div className="mt-5 grid gap-3 text-left text-sm text-white/65">
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3"><IconMapPin size={16} /> {utilisateur?.lieuNaissance || 'Lieu de naissance non renseigne'}</div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3"><IconFingerprint size={16} /> {utilisateur?.cin || 'CIN non renseigne'}</div>
          </div>
        </section>

        <form
          onSubmit={(e) => { e.preventDefault(); void modifierProfil({ email, prenom, nom, dateNaissance: dateNaissance || null, lieuNaissance, poste, cin, accroche, atouts }); }}
          className="rounded-3xl bg-glass p-6 shadow-glass"
        >
          <h2 className="text-xl font-semibold">Informations personnelles</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-white/65 sm:col-span-2">
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white" />
            </label>
            <label className="space-y-2 text-sm text-white/65">
              Prenom
              <input value={prenom} onChange={(e) => setPrenom(e.target.value)} className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white" />
            </label>
            <label className="space-y-2 text-sm text-white/65">
              Nom
              <input value={nom} onChange={(e) => setNom(e.target.value)} className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white" />
            </label>
            <label className="space-y-2 text-sm text-white/65">
              Date de naissance
              <input type="date" value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)} className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white" />
            </label>
            <label className="space-y-2 text-sm text-white/65">
              Lieu de naissance
              <input value={lieuNaissance} onChange={(e) => setLieuNaissance(e.target.value)} className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white" />
            </label>
            <label className="space-y-2 text-sm text-white/65">
              Poste
              <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white">
                <IconBriefcase size={18} className="shrink-0 text-white/50" />
                <input value={poste} onChange={(e) => setPoste(e.target.value)} className="min-w-0 flex-1 bg-transparent text-white" />
              </div>
            </label>
            <label className="space-y-2 text-sm text-white/65">
              CIN
              <input value={cin} onChange={(e) => setCin(e.target.value)} className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white" />
            </label>
            <label className="space-y-2 text-sm text-white/65 sm:col-span-2">
              Accroche
              <input value={accroche} onChange={(e) => setAccroche(e.target.value)} placeholder="Une phrase courte qui vous presente" className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white" />
            </label>
            <label className="space-y-2 text-sm text-white/65 sm:col-span-2">
              Mes atouts
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-white/60"><IconSparkles size={18} /> Competences, qualites, points forts</div>
                <textarea value={atouts} onChange={(e) => setAtouts(e.target.value)} rows={5} className="w-full resize-none bg-transparent text-white" />
              </div>
            </label>
          </div>
          <button className="mt-6 inline-flex items-center gap-2 rounded-2xl bouton-glass px-5 py-3 font-semibold"><IconDeviceFloppy size={18} /> Enregistrer</button>
        </form>
      </div>
    </div>
  );
}

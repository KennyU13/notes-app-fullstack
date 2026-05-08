CREATE TABLE "Utilisateur" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "motDePasse" TEXT NOT NULL,
  "prenom" TEXT NOT NULL,
  "nom" TEXT NOT NULL,
  "refreshToken" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Categorie" (
  "id" TEXT NOT NULL,
  "nom" TEXT NOT NULL,
  "couleur" TEXT NOT NULL DEFAULT '#6366f1',
  "icone" TEXT NOT NULL DEFAULT 'Folder',
  "utilisateurId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Categorie_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Note" (
  "id" TEXT NOT NULL,
  "titre" TEXT NOT NULL,
  "contenu" TEXT NOT NULL,
  "estFavorite" BOOLEAN NOT NULL DEFAULT false,
  "estArchivee" BOOLEAN NOT NULL DEFAULT false,
  "couleur" TEXT NOT NULL DEFAULT '#8b5cf6',
  "utilisateurId" TEXT NOT NULL,
  "categorieId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Tag" (
  "id" TEXT NOT NULL,
  "nom" TEXT NOT NULL,
  "utilisateurId" TEXT NOT NULL,
  CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "NoteTag" (
  "noteId" TEXT NOT NULL,
  "tagId" TEXT NOT NULL,
  CONSTRAINT "NoteTag_pkey" PRIMARY KEY ("noteId","tagId")
);

CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");
CREATE UNIQUE INDEX "Categorie_nom_utilisateurId_key" ON "Categorie"("nom", "utilisateurId");
CREATE UNIQUE INDEX "Tag_nom_utilisateurId_key" ON "Tag"("nom", "utilisateurId");
CREATE INDEX "Note_utilisateurId_idx" ON "Note"("utilisateurId");
CREATE INDEX "Note_categorieId_idx" ON "Note"("categorieId");

ALTER TABLE "Categorie" ADD CONSTRAINT "Categorie_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Note" ADD CONSTRAINT "Note_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Note" ADD CONSTRAINT "Note_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NoteTag" ADD CONSTRAINT "NoteTag_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NoteTag" ADD CONSTRAINT "NoteTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

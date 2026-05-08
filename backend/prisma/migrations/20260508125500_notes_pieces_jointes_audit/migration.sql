CREATE TABLE "PieceJointe" (
    "id" TEXT NOT NULL,
    "nomOriginal" TEXT NOT NULL,
    "nomFichier" TEXT NOT NULL,
    "typeMime" TEXT NOT NULL,
    "taille" INTEGER NOT NULL,
    "chemin" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PieceJointe_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "utilisateurId" TEXT,
    "email" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "succes" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PieceJointe_noteId_idx" ON "PieceJointe"("noteId");
CREATE INDEX "AuditLog_utilisateurId_idx" ON "AuditLog"("utilisateurId");
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

ALTER TABLE "PieceJointe" ADD CONSTRAINT "PieceJointe_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

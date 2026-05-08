ALTER TABLE "Note" ADD COLUMN "estEpinglee" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Note" ADD COLUMN "estSupprimee" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Note" ADD COLUMN "supprimeeAt" TIMESTAMP(3);

CREATE INDEX "Note_estSupprimee_idx" ON "Note"("estSupprimee");
CREATE INDEX "Note_estEpinglee_idx" ON "Note"("estEpinglee");

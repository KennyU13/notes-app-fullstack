import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  if (process.env.SEED_DEMO_DATA !== 'true') {
    console.log('Seed ignore : SEED_DEMO_DATA different de true.');
    return;
  }

  const motDePasse = await bcrypt.hash('password123', 12);
  const utilisateur = await prisma.utilisateur.upsert({
    where: { email: 'demo@notes.local' },
    update: {},
    create: {
      email: 'demo@notes.local',
      motDePasse,
      prenom: 'Demo',
      nom: 'Notes'
    }
  });

  const travail = await prisma.categorie.upsert({
    where: { nom_utilisateurId: { nom: 'Travail', utilisateurId: utilisateur.id } },
    update: {},
    create: {
      nom: 'Travail',
      couleur: '#06b6d4',
      icone: 'Briefcase',
      utilisateurId: utilisateur.id
    }
  });

  const personnel = await prisma.categorie.upsert({
    where: { nom_utilisateurId: { nom: 'Personnel', utilisateurId: utilisateur.id } },
    update: {},
    create: {
      nom: 'Personnel',
      couleur: '#8b5cf6',
      icone: 'User',
      utilisateurId: utilisateur.id
    }
  });

  const tagDemo = await prisma.tag.upsert({
    where: { nom_utilisateurId: { nom: 'demo', utilisateurId: utilisateur.id } },
    update: {},
    create: { nom: 'demo', utilisateurId: utilisateur.id }
  });

  const noteExistante = await prisma.note.findFirst({
    where: { utilisateurId: utilisateur.id, titre: 'Bienvenue dans Notes App' }
  });

  if (!noteExistante) {
    const note = await prisma.note.create({
      data: {
        titre: 'Bienvenue dans Notes App',
        contenu: 'Cette note est creee automatiquement pour verifier que la base, Prisma et les relations fonctionnent.',
        couleur: '#06b6d4',
        utilisateurId: utilisateur.id,
        categorieId: travail.id
      }
    });

    await prisma.noteTag.create({
      data: { noteId: note.id, tagId: tagDemo.id }
    });
  }

  await prisma.note.findFirst({
    where: { utilisateurId: utilisateur.id, categorieId: personnel.id }
  });

  console.log('Seed termine : compte demo@notes.local pret.');
}

main()
  .catch((erreur) => {
    console.error('Erreur pendant le seed Prisma', erreur);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

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

  const apprentissage = await prisma.categorie.upsert({
    where: { nom_utilisateurId: { nom: 'Apprentissage', utilisateurId: utilisateur.id } },
    update: {},
    create: {
      nom: 'Apprentissage',
      couleur: '#22c55e',
      icone: 'Book',
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

  const notesProjet = [
    {
      titre: 'Finaliser la gestion des exceptions',
      contenu: 'Verifier que les erreurs de connexion, inscription, validation et base de donnees retournent un format JSON clair avec message en francais.',
      couleur: '#6366f1',
      categorieId: travail.id,
      tags: ['backend', 'exceptions', 'auth'],
      estEpinglee: true
    },
    {
      titre: 'Tester le parcours Playwright',
      contenu: 'Executer le scenario complet : inscription, connexion, creation de categorie, note, edition, corbeille, profil et capture demo.',
      couleur: '#06b6d4',
      categorieId: apprentissage.id,
      tags: ['tests', 'playwright', 'qualite'],
      estEpinglee: true
    },
    {
      titre: 'Organiser les ports Docker',
      contenu: 'Garder Notes App sur le port 2000 pour eviter les conflits avec le portfolio et conserver le backend sur 3001.',
      couleur: '#22c55e',
      categorieId: travail.id,
      tags: ['docker', 'configuration'],
      estEpinglee: false
    },
    {
      titre: 'Preparer les donnees de demonstration',
      contenu: 'Ajouter un profil complet, des categories, des tags et plusieurs notes recentes afin de presenter le projet dans le README.',
      couleur: '#f59e0b',
      categorieId: personnel.id,
      tags: ['demo', 'readme', 'presentation'],
      estEpinglee: false
    }
  ];

  for (const noteProjet of notesProjet) {
    const existante = await prisma.note.findFirst({ where: { titre: noteProjet.titre, utilisateurId: utilisateur.id } });
    const note = existante
      ? await prisma.note.update({
          where: { id: existante.id },
          data: {
            contenu: noteProjet.contenu,
            couleur: noteProjet.couleur,
            categorieId: noteProjet.categorieId,
            estEpinglee: noteProjet.estEpinglee,
            estSupprimee: false,
            supprimeeAt: null,
            updatedAt: new Date()
          }
        })
      : await prisma.note.create({
          data: {
            titre: noteProjet.titre,
            contenu: noteProjet.contenu,
            couleur: noteProjet.couleur,
            utilisateurId: utilisateur.id,
            categorieId: noteProjet.categorieId,
            estEpinglee: noteProjet.estEpinglee
          }
        });

    await prisma.noteTag.deleteMany({ where: { noteId: note.id } });
    for (const nom of noteProjet.tags) {
      const tag = await prisma.tag.upsert({
        where: { nom_utilisateurId: { nom, utilisateurId: utilisateur.id } },
        update: {},
        create: { nom, utilisateurId: utilisateur.id }
      });
      await prisma.noteTag.create({ data: { noteId: note.id, tagId: tag.id } });
    }
  }

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

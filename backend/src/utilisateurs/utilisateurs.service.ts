import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ModifierProfilDto } from './dto/utilisateur.dto';

@Injectable()
export class UtilisateursService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly selectionProfil = {
    id: true,
    email: true,
    prenom: true,
    nom: true,
    photoProfil: true,
    dateNaissance: true,
    lieuNaissance: true,
    poste: true,
    cin: true,
    accroche: true,
    atouts: true,
    createdAt: true,
    updatedAt: true
  } as const;

  async profil(utilisateurId: string) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      select: this.selectionProfil
    });
    if (!utilisateur) throw new NotFoundException('Utilisateur introuvable');
    return utilisateur;
  }

  async modifierProfil(utilisateurId: string, dto: ModifierProfilDto) {
    const email = dto.email?.trim().toLowerCase();
    if (email) {
      const utilisateurExistant = await this.prisma.utilisateur.findUnique({ where: { email } });
      if (utilisateurExistant && utilisateurExistant.id !== utilisateurId) {
        throw new ConflictException('Cet email est deja utilise');
      }
    }

    return this.prisma.utilisateur.update({
      where: { id: utilisateurId },
      data: {
        ...(email !== undefined ? { email } : {}),
        ...(dto.prenom !== undefined ? { prenom: dto.prenom.trim() } : {}),
        ...(dto.nom !== undefined ? { nom: dto.nom.trim() } : {}),
        ...(dto.dateNaissance !== undefined ? { dateNaissance: dto.dateNaissance ? new Date(dto.dateNaissance) : null } : {}),
        ...(dto.lieuNaissance !== undefined ? { lieuNaissance: this.valeurOptionnelle(dto.lieuNaissance) } : {}),
        ...(dto.poste !== undefined ? { poste: this.valeurOptionnelle(dto.poste) } : {}),
        ...(dto.cin !== undefined ? { cin: this.valeurOptionnelle(dto.cin) } : {}),
        ...(dto.accroche !== undefined ? { accroche: this.valeurOptionnelle(dto.accroche) } : {}),
        ...(dto.atouts !== undefined ? { atouts: this.valeurOptionnelle(dto.atouts) } : {})
      },
      select: this.selectionProfil
    });
  }

  async modifierPhoto(utilisateurId: string, fichier?: { mimetype: string; size: number; buffer: Buffer }) {
    if (!fichier) throw new BadRequestException('Image de profil introuvable');
    if (!fichier.mimetype.startsWith('image/')) throw new BadRequestException('Le fichier doit etre une image');
    if (fichier.size > 2 * 1024 * 1024) throw new BadRequestException('La photo ne doit pas depasser 2 Mo');
    const photoProfil = `data:${fichier.mimetype};base64,${fichier.buffer.toString('base64')}`;
    return this.prisma.utilisateur.update({
      where: { id: utilisateurId },
      data: { photoProfil },
      select: this.selectionProfil
    });
  }

  private valeurOptionnelle(valeur?: string | null) {
    const nettoyee = valeur?.trim();
    return nettoyee ? nettoyee : null;
  }
}

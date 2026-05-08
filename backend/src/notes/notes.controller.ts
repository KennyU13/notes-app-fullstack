import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UtilisateurCourant, UtilisateurJwt } from '../commun/decorateurs/utilisateur-courant';
import { JwtAuthGuard } from '../commun/gardes/jwt-auth.guard';
import { CreerNoteDto, ModifierNoteDto, RechercherNotesDto } from './dto/note.dto';
import { NotesService } from './notes.service';

@ApiTags('Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notes: NotesService) {}

  @Get()
  lister(@UtilisateurCourant() utilisateur: UtilisateurJwt, @Query() filtre: RechercherNotesDto) {
    return this.notes.lister(utilisateur.id, filtre);
  }

  @Get('export/:format')
  async exporter(@UtilisateurCourant() utilisateur: UtilisateurJwt, @Param('format') format: 'json' | 'markdown' | 'pdf', @Res() reponse: Response) {
    const exportNotes = await this.notes.exporter(utilisateur.id, format);
    reponse.setHeader('Content-Type', exportNotes.typeMime);
    reponse.setHeader('Content-Disposition', `attachment; filename="${exportNotes.nomFichier}"`);
    return reponse.send(exportNotes.contenu);
  }

  @Post()
  creer(@UtilisateurCourant() utilisateur: UtilisateurJwt, @Body() dto: CreerNoteDto) {
    return this.notes.creer(utilisateur.id, dto);
  }

  @Delete('pieces-jointes/:pieceId')
  supprimerPieceJointe(@UtilisateurCourant() utilisateur: UtilisateurJwt, @Param('pieceId') pieceId: string) {
    return this.notes.supprimerPieceJointe(utilisateur.id, pieceId);
  }

  @Get(':id')
  obtenir(@UtilisateurCourant() utilisateur: UtilisateurJwt, @Param('id') id: string) {
    return this.notes.obtenir(utilisateur.id, id);
  }

  @Patch(':id')
  modifier(@UtilisateurCourant() utilisateur: UtilisateurJwt, @Param('id') id: string, @Body() dto: ModifierNoteDto) {
    return this.notes.modifier(utilisateur.id, id, dto);
  }

  @Delete(':id')
  supprimer(@UtilisateurCourant() utilisateur: UtilisateurJwt, @Param('id') id: string) {
    return this.notes.supprimer(utilisateur.id, id);
  }

  @Patch(':id/restaurer')
  restaurer(@UtilisateurCourant() utilisateur: UtilisateurJwt, @Param('id') id: string) {
    return this.notes.restaurer(utilisateur.id, id);
  }

  @Delete(':id/definitif')
  supprimerDefinitivement(@UtilisateurCourant() utilisateur: UtilisateurJwt, @Param('id') id: string) {
    return this.notes.supprimerDefinitivement(utilisateur.id, id);
  }

  @Patch(':id/favori')
  favori(@UtilisateurCourant() utilisateur: UtilisateurJwt, @Param('id') id: string) {
    return this.notes.basculerFavori(utilisateur.id, id);
  }

  @Patch(':id/archiver')
  archiver(@UtilisateurCourant() utilisateur: UtilisateurJwt, @Param('id') id: string) {
    return this.notes.basculerArchive(utilisateur.id, id);
  }

  @Patch(':id/epingler')
  epingler(@UtilisateurCourant() utilisateur: UtilisateurJwt, @Param('id') id: string) {
    return this.notes.basculerEpingle(utilisateur.id, id);
  }

  @Post(':id/pieces-jointes')
  @UseInterceptors(FileInterceptor('fichier'))
  ajouterPieceJointe(@UtilisateurCourant() utilisateur: UtilisateurJwt, @Param('id') id: string, @UploadedFile() fichier: any) {
    return this.notes.ajouterPieceJointe(utilisateur.id, id, fichier);
  }
}

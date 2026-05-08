import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UtilisateurCourant, UtilisateurJwt } from '../commun/decorateurs/utilisateur-courant';
import { JwtAuthGuard } from '../commun/gardes/jwt-auth.guard';
import { CreerTagDto } from './dto/tag.dto';
import { TagsService } from './tags.service';

@ApiTags('Tags')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tags: TagsService) {}

  @Get()
  lister(@UtilisateurCourant() utilisateur: UtilisateurJwt) {
    return this.tags.lister(utilisateur.id);
  }

  @Post()
  creer(@UtilisateurCourant() utilisateur: UtilisateurJwt, @Body() dto: CreerTagDto) {
    return this.tags.creer(utilisateur.id, dto);
  }

  @Delete(':id')
  supprimer(@UtilisateurCourant() utilisateur: UtilisateurJwt, @Param('id') id: string) {
    return this.tags.supprimer(utilisateur.id, id);
  }
}

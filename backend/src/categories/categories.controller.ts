import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UtilisateurCourant, UtilisateurJwt } from '../commun/decorateurs/utilisateur-courant';
import { JwtAuthGuard } from '../commun/gardes/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreerCategorieDto, ModifierCategorieDto } from './dto/categorie.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  lister(@UtilisateurCourant() utilisateur: UtilisateurJwt) {
    return this.categories.lister(utilisateur.id);
  }

  @Post()
  creer(@UtilisateurCourant() utilisateur: UtilisateurJwt, @Body() dto: CreerCategorieDto) {
    return this.categories.creer(utilisateur.id, dto);
  }

  @Patch(':id')
  modifier(@UtilisateurCourant() utilisateur: UtilisateurJwt, @Param('id') id: string, @Body() dto: ModifierCategorieDto) {
    return this.categories.modifier(utilisateur.id, id, dto);
  }

  @Delete(':id')
  supprimer(@UtilisateurCourant() utilisateur: UtilisateurJwt, @Param('id') id: string) {
    return this.categories.supprimer(utilisateur.id, id);
  }
}

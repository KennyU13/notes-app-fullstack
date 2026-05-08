import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch()
export class FiltreExceptions implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const requete = host.switchToHttp().getRequest<{ url?: string }>();
    const reponse = host.switchToHttp().getResponse<Response>();
    const erreur = this.normaliserErreur(exception);

    reponse.status(erreur.statut).json({
      succes: false,
      donnees: null,
      message: erreur.message,
      erreurs: erreur.erreurs,
      codeErreur: erreur.codeErreur,
      statut: erreur.statut,
      chemin: requete.url,
      horodatage: new Date().toISOString()
    });
  }

  private normaliserErreur(exception: unknown) {
    if (exception instanceof HttpException) {
      const statut = exception.getStatus();
      const corps = exception.getResponse();
      const erreurs = this.extraireErreurs(corps);
      return {
        statut,
        message: this.extraireMessage(corps) ?? this.messageParDefaut(statut),
        erreurs,
        codeErreur: this.codeErreur(statut)
      };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.normaliserErreurPrisma(exception);
    }

    return {
      statut: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Une erreur interne est survenue',
      erreurs: undefined,
      codeErreur: 'ERREUR_INTERNE'
    };
  }

  private normaliserErreurPrisma(exception: Prisma.PrismaClientKnownRequestError) {
    if (exception.code === 'P2002') {
      return {
        statut: HttpStatus.CONFLICT,
        message: 'Une ressource avec ces informations existe deja',
        erreurs: undefined,
        codeErreur: 'RESSOURCE_DEJA_EXISTANTE'
      };
    }

    if (exception.code === 'P2025') {
      return {
        statut: HttpStatus.NOT_FOUND,
        message: 'Ressource introuvable',
        erreurs: undefined,
        codeErreur: 'RESSOURCE_INTROUVABLE'
      };
    }

    return {
      statut: HttpStatus.BAD_REQUEST,
      message: 'La requete ne peut pas etre traitee',
      erreurs: undefined,
      codeErreur: 'ERREUR_BASE_DE_DONNEES'
    };
  }

  private extraireMessage(corps: unknown): string | undefined {
    if (typeof corps === 'string') return corps;
    if (corps && typeof corps === 'object' && 'message' in corps) {
      const message = (corps as { message: string | string[] }).message;
      return Array.isArray(message) ? message.join(', ') : message;
    }
    return undefined;
  }

  private extraireErreurs(corps: unknown): string[] | undefined {
    if (corps && typeof corps === 'object' && 'message' in corps) {
      const message = (corps as { message: string | string[] }).message;
      return Array.isArray(message) ? message : undefined;
    }
    return undefined;
  }

  private messageParDefaut(statut: number) {
    const messages: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'La requete est invalide',
      [HttpStatus.UNAUTHORIZED]: 'Authentification requise',
      [HttpStatus.FORBIDDEN]: 'Acces refuse',
      [HttpStatus.NOT_FOUND]: 'Ressource introuvable',
      [HttpStatus.CONFLICT]: 'Conflit avec une ressource existante',
      [HttpStatus.TOO_MANY_REQUESTS]: 'Trop de requetes envoyees',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'Une erreur interne est survenue'
    };
    return messages[statut] ?? 'Une erreur est survenue';
  }

  private codeErreur(statut: number) {
    const codes: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'REQUETE_INVALIDE',
      [HttpStatus.UNAUTHORIZED]: 'NON_AUTHENTIFIE',
      [HttpStatus.FORBIDDEN]: 'ACCES_REFUSE',
      [HttpStatus.NOT_FOUND]: 'RESSOURCE_INTROUVABLE',
      [HttpStatus.CONFLICT]: 'CONFLIT_RESSOURCE',
      [HttpStatus.TOO_MANY_REQUESTS]: 'TROP_DE_TENTATIVES',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'ERREUR_INTERNE'
    };
    return codes[statut] ?? 'ERREUR_HTTP';
  }
}

import { ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { FiltreExceptions } from './filtre-exceptions';

describe('FiltreExceptions', () => {
  const creerContexte = () => {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({ status }),
        getRequest: () => ({ url: '/auth/connexion' })
      })
    } as unknown as ArgumentsHost;
    return { host, status, json };
  };

  it('formalise les erreurs de validation', () => {
    const { host, status, json } = creerContexte();
    const filtre = new FiltreExceptions();

    filtre.catch(new BadRequestException(['Adresse email invalide', 'Le mot de passe est obligatoire']), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({
      succes: false,
      donnees: null,
      message: 'Adresse email invalide, Le mot de passe est obligatoire',
      erreurs: ['Adresse email invalide', 'Le mot de passe est obligatoire'],
      codeErreur: 'REQUETE_INVALIDE',
      statut: HttpStatus.BAD_REQUEST,
      chemin: '/auth/connexion'
    }));
  });

  it('masque les erreurs inconnues avec un message generique', () => {
    const { host, status, json } = creerContexte();
    const filtre = new FiltreExceptions();

    filtre.catch(new Error('mot de passe secret'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({
      succes: false,
      donnees: null,
      message: 'Une erreur interne est survenue',
      codeErreur: 'ERREUR_INTERNE'
    }));
  });
});

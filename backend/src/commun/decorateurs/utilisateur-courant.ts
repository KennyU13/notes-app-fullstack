import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type UtilisateurJwt = { id: string; email: string };

export const UtilisateurCourant = createParamDecorator((_data: unknown, ctx: ExecutionContext): UtilisateurJwt => {
  return ctx.switchToHttp().getRequest<{ user: UtilisateurJwt }>().user;
});

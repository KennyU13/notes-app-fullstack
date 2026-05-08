import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class FiltreExceptions implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const reponse = host.switchToHttp().getResponse<Response>();
    const statut = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const corps = exception instanceof HttpException ? exception.getResponse() : null;
    const message = this.extraireMessage(corps) ?? 'Une erreur interne est survenue';

    reponse.status(statut).json({ succes: false, donnees: null, message });
  }

  private extraireMessage(corps: unknown): string | undefined {
    if (typeof corps === 'string') return corps;
    if (corps && typeof corps === 'object' && 'message' in corps) {
      const message = (corps as { message: string | string[] }).message;
      return Array.isArray(message) ? message.join(', ') : message;
    }
    return undefined;
  }
}

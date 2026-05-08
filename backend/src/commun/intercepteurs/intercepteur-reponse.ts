import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class IntercepteurReponse implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((donnees) => {
        if (donnees && typeof donnees === 'object' && 'succes' in donnees) return donnees;
        return { succes: true, donnees };
      })
    );
  }
}

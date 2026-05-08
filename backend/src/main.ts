import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { FiltreExceptions } from './commun/filtres/filtre-exceptions';
import { IntercepteurReponse } from './commun/intercepteurs/intercepteur-reponse';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new FiltreExceptions());
  app.useGlobalInterceptors(new IntercepteurReponse());

  const swagger = new DocumentBuilder()
    .setTitle('API Notes personnelles')
    .setDescription('API REST de gestion de notes personnelles')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('documentation', app, SwaggerModule.createDocument(app, swagger));

  await app.listen(config.get<number>('PORT') ?? 3000);
}

bootstrap();

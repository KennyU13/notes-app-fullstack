import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { FiltreExceptions } from './commun/filtres/filtre-exceptions';
import { IntercepteurReponse } from './commun/intercepteurs/intercepteur-reponse';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const frontendUrl = config.get<string>('FRONTEND_URL');
  const corsOrigins = ['http://localhost:2000', 'http://127.0.0.1:2000', 'http://localhost:5173', 'http://127.0.0.1:5173'];
  if (frontendUrl && !corsOrigins.includes(frontendUrl)) corsOrigins.push(frontendUrl);

  app.enableCors({
    origin: corsOrigins,
    credentials: true
  });
  app.use(helmet());
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

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from "cookie-parser"
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser())
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
  });
  await app.listen(4000);

  
}
bootstrap();

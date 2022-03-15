import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
      credentials: true
    }
  });
  app.useGlobalPipes(new ValidationPipe());
  // app.enableCors();
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp, port } from './setup-app';

const cookieSession = require('cookie-session');

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupApp(app);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();

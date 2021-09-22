import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp, port } from './setup-app';

const cookieSession = require('cookie-session');

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupApp(app);

  await app.listen(parseInt(process.env.PORT) || 3000, '0.0.0.0');
}
bootstrap();

// To deploy to heroku some dev dependencies are required
// so set NPM_CONFIG_PRODUCTION to false
// like so heroku config:set NPM_CONFIG_PRODUCTION=false

import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');
import { ConfigService } from '@nestjs/config';

export let port: number;

export const setupApp = (app: any) => {
  const configService = app.get(ConfigService);
  const cookieKey = configService.get('COOKIE_KEY');

  port = configService.get('PORT');

  app.use(
    cookieSession({
      keys: [cookieKey],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
};

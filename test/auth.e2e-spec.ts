import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupApp } from '../src/setup-app';
const cookieSession = require('cookie-session');

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();
  });

  it('hanldes a signup request', () => {
    const emailProvided: string = 'test3@e2etest.com';
    return request(app.getHttpServer())
      .post('/v1/users/signup')
      .send({ email: emailProvided, password: 'Passw0rd' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(emailProvided);
      });
  });

  it('signup  as a new user then get the currently logged in user', async () => {
    const email = 'test123@e2etest.com';
    const res = await request(app.getHttpServer())
      .post('/v1/users/signup')
      .send({ email, password: 'asdf' })
      .expect(201);
    const cookie = res.get('Set-Cookie');
    const { body } = await request(app.getHttpServer())
      .get('/v1/users/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});

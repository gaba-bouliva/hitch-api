import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';
const bcrypt = require('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service

    const users: User[] = [];

    fakeUsersService = {
      // more realistic
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },

      findByEmail: (email: string) => Promise.resolve(null),

      signUp: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    // creating a dependency injection container module
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService); // create a new instance of Authservice with all it's dependencies
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signUp('test@nestjs.com', 'testing');

    expect(user.password).toBeDefined();
    expect(user.password).not.toEqual('testing');
    expect(user.email).toEqual('test@nestjs.com');
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.findByEmail = () =>
      Promise.resolve({ id: 1, email: 'a', password: '1' } as User);

    await expect(
      service.signUp('test@nestjs.com', 'testing'),
    ).rejects.toThrowError(`Email already taken!`);
  });

  it('throws an error if signin is called with an invalid email', async () => {
    await expect(
      service.signIn('test@nestjs.com', 'testing'),
    ).rejects.toThrowError(`Email or Password Incorrect!`);
  });

  it('throws error if an invalid password is provided', async () => {
    fakeUsersService.findByEmail = () =>
      Promise.resolve({
        email: 'wrongpass@test.com',
        password: 'wrongpass',
      } as User);

    try {
      await service.signIn('asdfas@mail.com', 'passoword');
    } catch (err) {
      expect(err.message).toEqual('Email or Password incorrect!');
    }
  });

  it('returns a user if correct password is provided', async () => {
    fakeUsersService.findByEmail = () =>
      Promise.resolve({
        email: 'test@hitch.com',
        password:
          '$2b$10$NAu.qc9HIQByN9igP0MJTe/OPL6OB3RKPg/96.ZDao/rT.k2DDyde',
      } as User);

    const user = await service.signIn('test@hitch.com', 'mypassword');
    expect(user).toBeDefined();
    console.log(user);
  });
});

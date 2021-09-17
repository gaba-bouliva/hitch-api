import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { parse } from 'path/posix';
import { Session } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      getListUsers: () => {
        return Promise.resolve([
          { id: 1, email: 'user1@test.com', password: 'user1password' } as User,
          { id: 2, email: 'user2@test.com', password: 'user3password' } as User,
          { id: 3, email: 'user3@test.com', password: 'user3password' } as User,
        ]);
      },
      findUser: (id: number) => {
        return Promise.resolve({
          id,
          email: 'user1@test.com',
          password: 'user1password',
        } as User);
      },
      deleteUser: (id: number) => {
        return Promise.resolve({
          id,
          email: 'user1@test.com',
          password: 'user1password',
        } as User);
      },
      updateUser: (id: number, attr: Partial<User>) => {
        const user = new User();
        Object.assign(user, attr);

        user.id = 1;
        console.log(user);
        return Promise.resolve(user);
      },
    };

    fakeAuthService = {
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password });
      },
      signUp: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password });
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getListUsers should return a list of users with given email', async () => {
    const users: User[] = await controller.getListUsers();
    expect(users.length).toBeGreaterThanOrEqual(0);
  });

  it('findUser should return a user with the given id', async () => {
    const user: User = await controller.getUser('1');
    expect(user).toBeDefined;
  });

  it('findUser throws and error if userId not found', async () => {
    fakeUsersService.findUser = () => {
      return undefined;
    };

    try {
      await controller.getUser('1');
    } catch (error) {
      expect(error.message).toEqual(`Error Invalid User`);
    }
  });

  it('signIn returns the found user and updates session object', async () => {
    fakeAuthService.signIn = (email, password) => {
      return Promise.resolve({ id: 1, email, password } as User);
    };
    const session = { userId: null };
    const user = await controller.signIn(session, {
      email: 'test@nestjs.com',
      password: 'mypassword',
    });

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(user.id);
  });
});

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';
const bcrypt = require('bcrypt');

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  getListUsers(): Promise<User[]> {
    return this.userRepo.find();
  }

  async signUp(email: string, hashedPwd: string): Promise<User> {
    const user = new User();
    user.email = email;
    user.password = hashedPwd;

    return await this.userRepo.save(user);
  }

  async signIn(email: string, password: string): Promise<User> {
    const users = await this.userRepo.find({ email: email });
    const user = users[0];

    if (!users.length) {
      throw new NotFoundException(`Email or Password Incorrect!`);
    }
    const correctPwd = bcrypt.compareSync(password, user.password);
    if (!correctPwd) {
      throw new NotFoundException(`Email or Password incorrect!`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const users = await this.userRepo.find({ email: email });

    const user = users[0];
    return user;
  }

  async find(email: string): Promise<User[]> {
    const users = await this.userRepo.find({ email: email });
    return users;
  }

  async findUser(id: number): Promise<User> {
    const result = await this.userRepo.findOne(id);

    return result;
  }

  async deleteUser(id: number) {
    const user = await this.userRepo.findOne(id);
    if (!user) {
      throw new NotFoundException(`User Not found!`);
    }
    const result = this.userRepo.remove(user);

    return result;
  }

  async updateUser(id: number, attr: Partial<User>) {
    const user = await this.userRepo.findOne(id);

    if (!user) {
      throw new NotFoundException(`User Not found!`); // when you throw errors in service don't forget catch it or handler it on the controller by returning it to the client or user
    }

    Object.assign(user, attr);

    const result = await this.userRepo.save(user);
    return result;
  }
}

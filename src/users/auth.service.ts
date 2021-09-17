import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
const bcrypt = require('bcrypt');
import { User } from './user.entity';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signUp(email: string, password: string): Promise<User> {
    // generate salt to hash plaintext password

    const userInDb = await this.userService.findByEmail(email);

    if (userInDb) {
      throw new BadRequestException(`Email already taken!`);
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPwd = bcrypt.hashSync(password, salt);

    const user = await this.userService.signUp(email, hashedPwd);

    if (!user) {
      throw new NotFoundException(`Error Unable to signup Try Again Later!`);
    }

    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`Email or Password Incorrect!`);
    }
    const correctPwd = bcrypt.compareSync(password, user.password);
    if (!correctPwd) {
      throw new NotFoundException(`Email or Password incorrect!`);
    }

    return user;
  }
}

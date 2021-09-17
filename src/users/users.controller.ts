import {
  BadRequestException,
  Body,
  Session,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { ShowUserDto } from './dtos/show-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

import { AuthGard } from '../guards/auth.guard';

@Controller('v1/users')
@Serialize(ShowUserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}
  @Get()
  getListUsers(): Promise<User[]> {
    return this.userService.getListUsers();
  }

  @Get('/whoami')
  @UseGuards(AuthGard)
  whoAmI(@CurrentUser() user) {
    return user;
  }

  @Post('/signup')
  async createUser(
    @Session() session,
    @Body() body: CreateUserDto,
  ): Promise<User> {
    const { password, email } = body;
    const user = await this.authService.signUp(email, password);
    if (user) {
      session.userId = user.id;
    }
    return user;
  }

  @Get('/:id')
  @UseGuards(AuthGard)
  getUser(@Param('id') id: string): Promise<User> {
    const validId = parseInt(id);
    if (isNaN(validId)) {
      throw new BadRequestException(`Please Enter a valid ID`);
    }

    const user = this.userService.findUser(validId);

    if (!user) {
      throw new BadRequestException(`Error Invalid User`);
    }
    return user;
  }

  @Delete('/:id')
  @UseGuards(AuthGard)
  deleteUser(@Param('id') id: string) {
    const validId = parseInt(id);
    if (isNaN(validId)) {
      throw new BadRequestException(`Please Enter a valid ID`);
    }

    return this.userService.deleteUser(validId);
  }

  @Patch('/:id')
  @UseGuards(AuthGard)
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const validId = parseInt(id);
    if (isNaN(validId)) {
      throw new BadRequestException(`Please Enter a valid ID`);
    }
    return this.userService.updateUser(validId, body);
  }

  @Post('/signin')
  async signIn(@Session() session, @Body() body: CreateUserDto) {
    const { email, password } = body;

    const user = await this.authService.signIn(email, password);
    if (user) {
      session.userId = user.id;
    }

    return user;
  }

  @Post('/signout')
  @UseGuards(AuthGard)
  singOut(@Session() session: any) {
    session.userId = null;
    return 'Bye Bye';
  }
}

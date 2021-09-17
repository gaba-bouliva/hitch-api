import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}
  /* interceptors can make use of dependency Injection so it also need to be added into the providers array in the parent module in order to use the interceptor globally i.e usermodule like so  Provides: ...{ provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor },*/

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session;

    if (userId) {
      const user = this.usersService.findUser(userId);
      request.currentUser = user;
    }

    return handler.handle();
  }
}

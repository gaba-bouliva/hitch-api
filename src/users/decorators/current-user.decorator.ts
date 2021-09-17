import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    // data represents the argument passed to the decorator but not needed
    const request = context.switchToHttp().getRequest();

    return request.currentUser; // currentUser was inserted into the request object through the current-user.interceptor
  },
);

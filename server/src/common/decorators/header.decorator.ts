import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CustomHeaders = createParamDecorator(
  async (value, ctx: ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest().headers;

    return value ? headers[value] : headers;
  },
);

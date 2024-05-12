import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { SessionService } from './schedule.service';

@Controller("/session")
export class SessionController {
  constructor(private readonly sessionService: SessionService) { }
  @Get("/:uniqueCode")
  getSchedule(
    @Param() params: any
  ): any {
    console.log('uniqueCode: ', params.uniqueCode);
    return this.sessionService.getSchedule(params.uniqueCode);
  }

  @Post("/")
  createSchedule(
    @Body() body: any,
  ) {
    return this.sessionService.createSchedule(body);
  }
}

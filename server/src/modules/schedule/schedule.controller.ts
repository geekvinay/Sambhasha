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
  @Get("/:scheduleId")
  getSchedule(
    @Param() params: string
  ): any {
    return this.sessionService.getSchedule(params);
  }

  @Post("/")
  createSchedule(
    @Body() body: any,
  ) {
    return this.sessionService.createSchedule(body);
  }
}

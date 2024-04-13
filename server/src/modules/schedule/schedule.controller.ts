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

  @Get("/")
  getHello(): string {
    return this.sessionService.getHello();
  }

  @Get("/:scheduleId")
  getSchedule(
    @Param() params: string
  ): any {
    return this.sessionService.getSchedule(params);
  }

  @Get("/:scheduleId/agora-token")
  getAgoraTokenForSchedule(@Param() params: string): any {
    return this.sessionService.getAgoraToken(params);
  }

  @Post("/")
  createSchedule(
    // @CustomHeaders() headers: HeaderUserOrganizationDto,
    @Body() body: any,
  ) {
    console.log('body: ', body);
    return this.sessionService.createSchedule(body);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Delete,
  Put,
} from '@nestjs/common';
import { SessionService } from './schedule.service';
import { CustomHeaders } from 'src/common/decorators/header.decorator';

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

  @Post("/")
  createSchedule(
    // @CustomHeaders() headers: HeaderUserOrganizationDto,
    @Body() body: any,
  ) {
    console.log('body: ', body);
    return this.sessionService.createSchedule(body);
  }
}

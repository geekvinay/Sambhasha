import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./users.service";

@Controller("/users")
export class UsersController {
  constructor(private readonly userService: UserService) { }

  @Get("/:userId")
  getSchedule(
    @Param() userId: string
  ): any {
    return this.userService.getUser(userId);
  }

  @Post("")
  createUser(
    @Body() body: any
  ): any {
    return this.userService.createUser(body);
  }
}

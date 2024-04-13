import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto, FetchUserDto } from "./dto/users.dto";

@Controller("/v1/users")
export class UsersController {
  constructor(private readonly userService: UserService) { }

  @Get("/:userId")
  getUser(
    @Param() params: FetchUserDto
  ) {
    return this.userService.getUser(params);
  }

  @Post("")
  createUser(
    @Body() body: CreateUserDto
  ) {
    console.log('body: ', body);
    return this.userService.createUser(body);
  }
}

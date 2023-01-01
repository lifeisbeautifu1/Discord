import { Controller, Get, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "src/auth/decorator";
import { AuthenticatedGuard } from "src/auth/guard/authenticated.guard";

@Controller("users")
export class UserController {
  @UseGuards(AuthenticatedGuard)
  @Get("me")
  getMe(@GetUser() user: User) {
    return user;
  }
}

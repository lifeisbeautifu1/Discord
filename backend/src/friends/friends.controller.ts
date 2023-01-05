import { Controller, Delete, Get, Param, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { AuthenticatedGuard } from "src/auth/utils/guards";
import { GetUser } from "src/utils/decorators";
import { FriendsService } from "./friends.service";

@Controller("/friends")
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  async getFriends(@GetUser() user: User) {
    return await this.friendsService.getFriends(user.id);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(":id/delete")
  async deleteFriend(@Param("id") id: string, @GetUser() user: User) {
    return await this.friendsService.deleteFriend(id, user);
  }
}

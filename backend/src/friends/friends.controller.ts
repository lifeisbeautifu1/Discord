import { Controller, Delete, Get, Param, UseGuards } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { User } from "@prisma/client";
import { AuthenticatedGuard } from "src/auth/utils/guards";
import { Routes, ServerEvents } from "src/utils/constants";
import { GetUser } from "src/utils/decorators";
import { FriendsService } from "./friends.service";

@UseGuards(AuthenticatedGuard)
@Controller(Routes.FRIENDS)
export class FriendsController {
  constructor(
    private friendsService: FriendsService,
    private event: EventEmitter2,
  ) {}

  @Get()
  async getFriends(@GetUser() user: User) {
    return await this.friendsService.getFriends(user.id);
  }

  @Delete(":id/delete")
  async deleteFriend(@Param("id") id: string, @GetUser() user: User) {
    const friend = await this.friendsService.deleteFriend(id, user);
    this.event.emit(ServerEvents.FRIEND_REMOVED, { friend, userId: user.id });
    return friend;
  }
}

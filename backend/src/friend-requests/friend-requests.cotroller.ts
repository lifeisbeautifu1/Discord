import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { AuthenticatedGuard } from "src/auth/utils/guards";
import { GetUser } from "src/utils/decorators";
import { SendFriendRequestDto } from "./dtos/CreateFriendDto";
import { FriendRequestService } from "./friend-requests.service";

@Controller("friends/requests")
export class FriendRequestController {
  constructor(private friendRequestsService: FriendRequestService) {}

  @UseGuards(AuthenticatedGuard)
  @Post()
  async sendFriendRequest(
    @Body() dto: SendFriendRequestDto,
    @GetUser() user: User,
  ) {
    return await this.friendRequestsService.create(user, dto.u_name);
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  async getFriendRequests(@GetUser() user: User) {
    return await this.friendRequestsService.getFriendRequests(user.id);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(":id/cancel")
  async cancelFriendRequest(@GetUser() user: User, @Param("id") id: string) {
    const response = await this.friendRequestsService.cancel(user, id);
    return response;
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(":id/accept")
  async acceptFriendRequest(@GetUser() user: User, @Param("id") id: string) {
    const response = await this.friendRequestsService.accept(user, id);
    return response;
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(":id/reject")
  async rejectFriendRequest(@GetUser() user: User, @Param("id") id: string) {
    const response = await this.friendRequestsService.reject(user, id);
    return response;
  }
}

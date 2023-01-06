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
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Throttle } from "@nestjs/throttler";
import { User } from "@prisma/client";
import { AuthenticatedGuard } from "src/auth/utils/guards";
import { GetUser } from "src/utils/decorators";
import { SendFriendRequestDto } from "./dtos/CreateFriendDto";
import { FriendRequestService } from "./friend-requests.service";
import { Routes, ServerEvents } from "src/utils/constants";

@Controller(Routes.FRIEND_REQUESTS)
export class FriendRequestController {
  constructor(
    private friendRequestsService: FriendRequestService,
    private event: EventEmitter2,
  ) {}

  @Throttle(3, 10)
  @UseGuards(AuthenticatedGuard)
  @Post()
  async sendFriendRequest(
    @Body() dto: SendFriendRequestDto,
    @GetUser() user: User,
  ) {
    const response = await this.friendRequestsService.create(user, dto.u_name);
    this.event.emit(ServerEvents.FRIEND_REQUEST_CREATE, response);
    return response;
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  async getFriendRequests(@GetUser() user: User) {
    return await this.friendRequestsService.getFriendRequests(user.id);
  }

  @Throttle(3, 10)
  @UseGuards(AuthenticatedGuard)
  @Delete(":id/cancel")
  async cancelFriendRequest(@GetUser() user: User, @Param("id") id: string) {
    const response = await this.friendRequestsService.cancel(user, id);
    this.event.emit(ServerEvents.FRIEND_REQUEST_CANCEL, response);
    return response;
  }

  @Throttle(3, 10)
  @UseGuards(AuthenticatedGuard)
  @Patch(":id/accept")
  async acceptFriendRequest(@GetUser() user: User, @Param("id") id: string) {
    const response = await this.friendRequestsService.accept(user, id);
    this.event.emit(ServerEvents.FRIEND_REQUEST_ACCEPTED, response);
    return response;
  }

  @Throttle(3, 10)
  @UseGuards(AuthenticatedGuard)
  @Patch(":id/reject")
  async rejectFriendRequest(@GetUser() user: User, @Param("id") id: string) {
    const response = await this.friendRequestsService.reject(user, id);
    this.event.emit(ServerEvents.FRIEND_REQUEST_REJECTED, response);
    return response;
  }
}

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
import { ConversationsService } from "src/conversations/conversations.service";

@UseGuards(AuthenticatedGuard)
@Controller(Routes.FRIEND_REQUESTS)
export class FriendRequestController {
  constructor(
    private friendRequestsService: FriendRequestService,
    private conversationsService: ConversationsService,
    private event: EventEmitter2,
  ) {}

  @Throttle(3, 10)
  @Post()
  async sendFriendRequest(
    @Body() dto: SendFriendRequestDto,
    @GetUser() user: User,
  ) {
    const response = await this.friendRequestsService.create(user, dto.u_name);
    this.event.emit(ServerEvents.FRIEND_REQUEST_CREATED, response);
    return response;
  }

  @Get()
  async getFriendRequests(@GetUser() user: User) {
    return await this.friendRequestsService.getFriendRequests(user.id);
  }

  @Throttle(3, 10)
  @Delete(":id/cancel")
  async cancelFriendRequest(@GetUser() user: User, @Param("id") id: string) {
    const response = await this.friendRequestsService.cancel(user, id);
    this.event.emit(ServerEvents.FRIEND_REQUEST_CANCELED, response);
    return response;
  }

  @Throttle(3, 10)
  @Patch(":id/accept")
  async acceptFriendRequest(@GetUser() user: User, @Param("id") id: string) {
    const response = await this.friendRequestsService.accept(user, id);
    this.event.emit(ServerEvents.FRIEND_REQUEST_ACCEPTED, response);
    const isConversation = await this.conversationsService.isCreated([
      response.friendRequest.senderId,
      response.friendRequest.receiverId,
    ]);
    if (!isConversation) {
      const conversation = await this.conversationsService.createConversation(
        user,
        [response.friendRequest.senderId, response.friendRequest.receiverId],
      );
      this.event.emit(ServerEvents.CONVERSATION_CREATED, conversation);
    }
    return response;
  }

  @Throttle(3, 10)
  @Patch(":id/reject")
  async rejectFriendRequest(@GetUser() user: User, @Param("id") id: string) {
    const response = await this.friendRequestsService.reject(user, id);
    this.event.emit(ServerEvents.FRIEND_REQUEST_REJECTED, response);
    return response;
  }
}

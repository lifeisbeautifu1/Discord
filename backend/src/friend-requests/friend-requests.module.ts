import { Module } from "@nestjs/common";
import { ConversationsService } from "src/conversations/conversations.service";
import { FriendsService } from "src/friends/friends.service";
import { UserService } from "src/user/user.service";
import { FriendRequestController } from "./friend-requests.controller";
import { FriendRequestService } from "./friend-requests.service";

@Module({
  providers: [
    FriendRequestService,
    UserService,
    FriendsService,
    ConversationsService,
  ],
  controllers: [FriendRequestController],
})
export class FriendRequestsModule {}

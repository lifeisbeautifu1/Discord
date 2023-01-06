import { Module } from "@nestjs/common";
import { FriendsService } from "src/friends/friends.service";
import { UserService } from "src/user/user.service";
import { FriendRequestController } from "./friend-requests.controller";
import { FriendRequestService } from "./friend-requests.service";

@Module({
  providers: [FriendRequestService, UserService, FriendsService],
  controllers: [FriendRequestController],
})
export class FriendRequestsModule {}

import { Module } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { FriendRequestController } from "./friend-requests.cotroller";
import { FriendRequestService } from "./friend-requests.service";

@Module({
  providers: [FriendRequestService, UserService],
  controllers: [FriendRequestController],
})
export class FriendRequestsModule {}

import { Module } from "@nestjs/common";
import { GatewayModule } from "src/gateway/gateway.module";
import { FriendRequestsEvents } from "./friend-requests.events";
import { FriendsEvents } from "./friends.events";

@Module({
  imports: [GatewayModule],
  providers: [FriendRequestsEvents, FriendsEvents],
})
export class EventsModule {}

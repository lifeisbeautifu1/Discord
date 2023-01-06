import { Module } from "@nestjs/common";
import { FriendsModule } from "src/friends/friends.module";
import { MessagingGateway } from "./gateway";
import { GatewaySessionManager } from "./gateway.session";

@Module({
  imports: [FriendsModule],
  providers: [MessagingGateway, GatewaySessionManager],
  exports: [MessagingGateway, GatewaySessionManager],
})
export class GatewayModule {}

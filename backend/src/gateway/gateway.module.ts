import { Module } from "@nestjs/common";
import { ConversationsService } from "src/conversations/conversations.service";
import { FriendsModule } from "src/friends/friends.module";
import { MessagingGateway } from "./gateway";
import { GatewaySessionManager } from "./gateway.session";

@Module({
  imports: [FriendsModule],
  providers: [MessagingGateway, GatewaySessionManager, ConversationsService],
  exports: [MessagingGateway, GatewaySessionManager],
})
export class GatewayModule {}

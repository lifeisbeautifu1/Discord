import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { FriendsModule } from "src/friends/friends.module";
import { UserModule } from "src/user/user.module";
import { isAuthorized } from "src/utils/helpers";
import { ConversationsController } from "./conversations.controller";
import { ConversationsService } from "./conversations.service";
import { ConversationMiddleware } from "./middleware/conversation.middleware";

@Module({
  imports: [FriendsModule, UserModule],
  providers: [ConversationsService],
  controllers: [ConversationsController],
  exports: [ConversationsService],
})
export class ConversationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(isAuthorized, ConversationMiddleware)
      .forRoutes("conversations/:id");
  }
}

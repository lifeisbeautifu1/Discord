import { Module } from "@nestjs/common";
import { ConversationsModule } from "src/conversations/conversations.module";
import { NotificationsModule } from "src/notifications/notifications.module";
import { MessagesController } from "./messages.controller";
import { MessagesService } from "./messages.service";

@Module({
  imports: [ConversationsModule, NotificationsModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}

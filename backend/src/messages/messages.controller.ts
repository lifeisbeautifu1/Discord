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
import { SkipThrottle, Throttle } from "@nestjs/throttler";
import { User } from "@prisma/client";
import { AuthenticatedGuard } from "src/auth/utils/guards";
import { NotificationsService } from "src/notifications/notifications.service";
import { Routes, ServerEvents } from "src/utils/constants";
import { GetUser } from "src/utils/decorators";
import { CreateMessageDto } from "./dto/CreateMessage.dto";
import { EditMessageDto } from "./dto/EditMessage.dto";
import { MessagesService } from "./messages.service";

@UseGuards(AuthenticatedGuard)
@Controller(Routes.MESSAGES)
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly notificationsService: NotificationsService,
    private readonly event: EventEmitter2,
  ) {}

  @Post()
  async createMessage(
    @GetUser() user: User,
    @Param("id") conversationId: string,
    @Body() dto: CreateMessageDto,
  ) {
    const response = await this.messagesService.createMessage(
      user.id,
      dto.content,
      conversationId,
    );
    const notifications = await this.notificationsService.createNotification({
      userId: user.id,
      messageId: response.message.id,
      conversationId,
    });
    this.event.emit(ServerEvents.NEW_NOTIFICATIONS, notifications);
    this.event.emit(ServerEvents.MESSAGE_CREATED, response);
    return;
  }

  @SkipThrottle()
  @Get()
  async getMessagesFromConversation(@Param("id") id: string) {
    const messages = await this.messagesService.getMessages(id);
    const firstMessage = await this.messagesService.getFirstMessage(id);

    return {
      messages,
      more:
        messages?.length > 0 &&
        firstMessage.id !== messages[messages.length - 1]?.id,
    };
  }

  @SkipThrottle()
  @Get(":messageId")
  async getMessagesAfterMessageFromConversation(
    @Param("id") conversationId: string,
    @Param("messageId") messageId: string,
  ) {
    const messages = await this.messagesService.getMessagesAfterMessage(
      conversationId,
      messageId,
    );
    const firstMessage = await this.messagesService.getFirstMessage(
      conversationId,
    );
    return {
      messages,
      more:
        messages?.length > 0 &&
        firstMessage.id !== messages[messages.length - 1]?.id,
    };
  }

  @Delete(":messageId")
  async deleteMessageFromConversation(
    @GetUser() user: User,
    @Param("id") conversationId: string,
    @Param("messageId") messageId: string,
  ) {
    const conversation = await this.messagesService.deleteMessage(
      conversationId,
      user.id,
      messageId,
    );
    this.event.emit(ServerEvents.MESSAGE_DELETED, {
      userId: user.id,
      conversation,
      messageId,
    });
    return;
  }

  @Patch(":messageId")
  async editMessage(
    @GetUser() user: User,
    @Param("id") conversationId: string,
    @Param("messageId") messageId: string,
    @Body() dto: EditMessageDto,
  ) {
    const message = await this.messagesService.editMessage(
      dto.content,
      user.id,
      messageId,
    );
    this.event.emit(ServerEvents.MESSAGE_UPDATED, message);
    return;
  }
}

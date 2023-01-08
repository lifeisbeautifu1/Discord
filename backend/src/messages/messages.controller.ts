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
    private readonly event: EventEmitter2,
  ) {}

  @Post()
  async createMessage(
    @GetUser() user: User,
    @Param("id") id: string,
    @Body() dto: CreateMessageDto,
  ) {
    const response = await this.messagesService.createMessage(
      user,
      dto.content,
      id,
    );
    this.event.emit(ServerEvents.MESSAGE_CREATE, response);
    return;
  }

  @SkipThrottle()
  @Get()
  async getMessagesFromConversation(
    @GetUser() user: User,
    @Param("id") id: string,
  ) {
    const messages = await this.messagesService.getMessages(id);
    return messages;
  }

  @Delete(":messageId")
  async deleteMessageFromConversation(
    @GetUser() user: User,
    @Param("id") conversationId: string,
    @Param("messageId") messageId: string,
  ) {
    await this.messagesService.deleteMessage(
      conversationId,
      user.id,
      messageId,
    );
    return { conversationId, messageId };
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
  }
}

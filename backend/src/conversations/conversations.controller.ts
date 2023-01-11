import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SkipThrottle } from "@nestjs/throttler";
import { User } from "@prisma/client";
import { AuthenticatedGuard } from "src/auth/utils/guards";
import { Routes, ServerEvents } from "src/utils/constants";
import { GetUser } from "src/utils/decorators";
import { ConversationsService } from "./conversations.service";
import { CreateConversationDto } from "./dto/CreateConversation.dto";

@SkipThrottle()
@UseGuards(AuthenticatedGuard)
@Controller(Routes.CONVERSATIONS)
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly event: EventEmitter2,
  ) {}

  @Post()
  async createConversation(
    @GetUser() user: User,
    @Body() dto: CreateConversationDto,
  ) {
    const conversation = await this.conversationsService.createConversation(
      user,
      dto.participantsIds,
    );
    this.event.emit(ServerEvents.CONVERSATION_CREATED, conversation);
    return conversation;
  }

  @Get()
  async getConversations(@GetUser() user: User) {
    return this.conversationsService.getConversations(user.id);
  }

  @Get(":id")
  async getConversation(@Param("id") id: string) {
    return this.conversationsService.findById(id);
  }
}

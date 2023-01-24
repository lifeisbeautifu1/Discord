import { BadRequestException, Injectable } from "@nestjs/common";
import { Message, User } from "@prisma/client";
import { ConversationsService } from "src/conversations/conversations.service";
import { PrismaService } from "src/prisma/prisma.service";
import { userSelectedFields } from "src/utils/constants/userSelectedFields";

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly conversationsService: ConversationsService,
  ) {}

  async createMessage(userId: string, content: string, conversationId: string) {
    const message = await this.prisma.message.create({
      data: {
        content,
        conversationId,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            ...userSelectedFields,
          },
        },
      },
    });
    const participant = await this.prisma.conversationParticipant.findFirst({
      where: {
        userId,
        conversationId,
      },
    });
    const updatedConversation = await this.conversationsService.update(
      participant.id,
      userId,
      conversationId,
      message,
    );
    return {
      message,
      conversation: updatedConversation,
    };
  }

  getFirstMessage(conversationId: string) {
    return this.prisma.message.findFirst({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  getMessagesAfterMessage(conversationId: string, messageId: string) {
    const take = 50;
    return this.prisma.message.findMany({
      where: {
        conversationId,
      },
      take,
      skip: 1,
      cursor: {
        id: messageId,
      },
      include: {
        author: {
          select: {
            ...userSelectedFields,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  getMessages(conversationId: string) {
    const take = 50;
    return this.prisma.message.findMany({
      where: {
        conversationId,
      },
      take,
      include: {
        author: {
          select: {
            ...userSelectedFields,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async deleteMessage(
    conversationId: string,
    userId: string,
    messageId: string,
  ) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                ...userSelectedFields,
              },
            },
          },
        },
      },
    });
    const message = await this.prisma.message.findFirst({
      where: {
        id: messageId,
        authorId: userId,
        conversationId,
      },
    });
    if (!message) throw new BadRequestException("Message not found");
    if (messageId !== conversation.latestMessageId) {
      await this.prisma.message.delete({
        where: {
          id: messageId,
        },
      });
    } else {
      const messages = await this.prisma.message.findMany({
        where: {
          conversationId: conversationId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      });
      await this.deleteLastMessage(conversationId, messages, message);
    }
    return conversation;
  }

  async deleteLastMessage(
    conversationId: string,
    messages: Array<Message>,
    message: Message,
  ) {
    const size = messages.length;
    const SECOND_MESSAGE_INDEX = 1;
    if (size <= 1) {
      await this.prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          latestMessageId: null,
        },
      });
      await this.prisma.message.delete({
        where: {
          id: message.id,
        },
      });
    } else {
      const newLastMessage = messages[SECOND_MESSAGE_INDEX];
      await this.prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          latestMessageId: newLastMessage.id,
        },
      });
      await this.prisma.message.delete({
        where: {
          id: message.id,
        },
      });
    }
  }

  async editMessage(content: string, userId: string, messageId: string) {
    const message = await this.prisma.message.findFirst({
      where: {
        id: messageId,
        authorId: userId,
      },
    });
    if (!message) throw new BadRequestException("Can't edit message");
    return this.prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        content,
      },
      include: {
        conversation: {
          include: {
            participants: {
              include: {
                user: {
                  select: { ...userSelectedFields },
                },
              },
            },
          },
        },
      },
    });
  }
}

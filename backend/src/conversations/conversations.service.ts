import { BadRequestException, Injectable } from "@nestjs/common";
import { Message, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { userSelectedFields } from "src/utils/constants/userSelectedFields";

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
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
    return conversations.filter(
      (conversation) =>
        !!conversation.participants.find((p) => p.userId === userId),
    );
  }

  async createConversation(user: User, participantsIds: Array<string>) {
    const exist = await this.isCreated(participantsIds);

    if (exist) throw new BadRequestException("Conversation already exist");

    const conversation = await this.prisma.conversation.create({
      data: {
        participants: {
          createMany: {
            data: participantsIds.map((id) => ({
              userId: id,
              hasSeenLatestMessage: id == user.id,
            })),
          },
        },
      },
      include: {
        participants: {
          select: {
            userId: true,
            user: {
              select: {
                ...userSelectedFields,
              },
            },
          },
        },
      },
    });
    return conversation;
  }

  async isCreated(participantsIds: Array<string>) {
    const conversations = await this.prisma.conversation.findMany({
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
    const conversation = conversations.filter(
      (conversation) =>
        conversation.participants.every((p) =>
          participantsIds.includes(p.userId),
        ) && conversation.participants.length === participantsIds.length,
    );

    return conversation.length === 0 ? null : conversation[0];
  }

  findById(id: string) {
    return this.prisma.conversation.findFirst({
      where: {
        id,
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
        latestMessage: true,
      },
    });
  }

  async hasAccess(conversationId: string, userId: string) {
    const conversation = await this.findById(conversationId);

    if (!conversation)
      throw new BadRequestException("Conversation doesn't exist");

    return conversation.participants.some((p) => p.userId === userId);
  }

  update(
    participantId: string,
    userId: string,
    conversationId: string,
    message: Message,
  ) {
    return this.prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        latestMessageId: message.id,
        participants: {
          update: {
            where: {
              id: participantId,
            },
            data: {
              hasSeenLatestMessage: true,
            },
          },
          updateMany: {
            where: {
              NOT: {
                userId,
              },
            },
            data: {
              hasSeenLatestMessage: false,
            },
          },
        },
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
  }
}

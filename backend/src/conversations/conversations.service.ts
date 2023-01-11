import { BadRequestException, Injectable } from "@nestjs/common";
import { Message, User } from "@prisma/client";
import { FriendsService } from "src/friends/friends.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
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
    return (
      conversations.filter((conversation) =>
        conversation.participants.every((p) =>
          participantsIds.includes(p.userId),
        ),
      ).length !== 0
    );
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

  update(id: string, lastMessageSent: Message) {
    return this.prisma.conversation.update({
      where: {
        id,
      },
      data: {
        latestMessageId: lastMessageSent.id,
      },
    });
  }
}
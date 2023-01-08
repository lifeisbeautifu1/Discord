import { BadRequestException, Injectable } from "@nestjs/common";
import { Message, User } from "@prisma/client";
import { FriendsService } from "src/friends/friends.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { userSelectedFields } from "src/utils/constants/userSelectedFields";

@Injectable()
export class ConversationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly friendsService: FriendsService,
  ) {}

  getConversations(id: string) {
    return this.prisma.conversation.findMany({
      where: {
        OR: [
          {
            creatorId: id,
          },
          {
            recipientId: id,
          },
        ],
      },
      include: {
        creator: {
          select: {
            ...userSelectedFields,
          },
        },
        recipient: {
          select: {
            ...userSelectedFields,
          },
        },
        lastMessageSent: true,
      },
    });
  }

  async createConversation(creator: User, u_name: string) {
    const recipient = await this.userService.findUserByUName(u_name);

    if (!recipient) throw new BadRequestException("User not found");

    if (creator.id === recipient.id)
      throw new BadRequestException("Cannot create conversation with yourself");

    const isFriends = await this.friendsService.isFriends(
      creator.id,
      recipient.id,
    );
    if (!isFriends) throw new BadRequestException("Not friends");

    const exist = await this.isCreated(creator.id, recipient.id);

    if (exist) throw new BadRequestException("Conversation already exist");

    const newConversation = await this.prisma.conversation.create({
      data: {
        creatorId: creator.id,
        recipientId: recipient.id,
      },
      include: {
        creator: {
          select: {
            ...userSelectedFields,
          },
        },
        recipient: {
          select: {
            ...userSelectedFields,
          },
        },
      },
    });
    return newConversation;
  }

  async isCreated(creatorId: string, recipientId: string) {
    return this.prisma.conversation.findFirst({
      where: {
        OR: [
          {
            creatorId,
            recipientId,
          },
          {
            recipientId: creatorId,
            creatorId: recipientId,
          },
        ],
      },
    });
  }

  findById(id: string) {
    return this.prisma.conversation.findFirst({
      where: {
        id,
      },
      include: {
        creator: {
          select: {
            ...userSelectedFields,
          },
        },
        recipient: {
          select: {
            ...userSelectedFields,
          },
        },
        lastMessageSent: true,
      },
    });
  }

  async hasAccess(id: string, userId: string) {
    const conversation = await this.findById(id);

    if (!conversation)
      throw new BadRequestException("Conversation doesn't exist");

    return (
      conversation.creatorId === userId || conversation.recipientId === userId
    );
  }

  update(id: string, lastMessageSent: Message) {
    return this.prisma.conversation.update({
      where: {
        id,
      },
      data: {
        messageId: lastMessageSent.id,
      },
    });
  }
}

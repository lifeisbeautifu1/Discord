import { BadRequestException, Injectable } from "@nestjs/common";
import { Friend, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { userSelectedFields } from "src/utils/constants/userSelectedFields";

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  getFriends(id: string): Promise<Friend[]> {
    return this.prisma.friend.findMany({
      where: {
        OR: [
          {
            senderId: id,
          },
          {
            receiverId: id,
          },
        ],
      },
      include: {
        sender: {
          select: {
            ...userSelectedFields,
          },
        },
        receiver: {
          select: {
            ...userSelectedFields,
          },
        },
      },
    });
  }

  findFriendById(id: string): Promise<Friend> {
    return this.prisma.friend.findFirst({
      where: {
        id,
      },
      include: {
        sender: {
          select: {
            ...userSelectedFields,
          },
        },
        receiver: {
          select: {
            ...userSelectedFields,
          },
        },
      },
    });
  }

  async deleteFriend(id: string, user: User) {
    const friend = await this.findFriendById(id);
    if (!friend)
      throw new BadRequestException(`Friend with id ${id} doesn't exist`);
    if (friend.receiverId !== user.id && friend.senderId !== user.id)
      throw new BadRequestException("Can't delete this friend");
    await this.prisma.friend.delete({
      where: {
        id,
      },
    });
    return friend;
  }

  isFriends(userOneId: string, userTwoId: string): Promise<Friend> {
    return this.prisma.friend.findFirst({
      where: {
        OR: [
          {
            senderId: userOneId,
            receiverId: userTwoId,
          },
          {
            senderId: userTwoId,
            receiverId: userOneId,
          },
        ],
      },
    });
  }
}

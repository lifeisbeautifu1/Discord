import { BadRequestException, Injectable } from "@nestjs/common";
import { FriendRequest, User } from "@prisma/client";
import { FriendsService } from "src/friends/friends.service";

import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { userSelectedFields } from "src/utils/constants/userSelectedFields";

@Injectable()
export class FriendRequestService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private friendsService: FriendsService,
  ) {}
  async create(user: User, u_name: string): Promise<FriendRequest> {
    const receiver = await this.userService.findUserByUName(u_name);

    // Check if user with u_name doesn't exist
    if (!receiver) {
      throw new BadRequestException(`User with username ${u_name} not found`);
    }

    // Check if friend request exists
    const isPending = await this.isPending(user.id, receiver.id);
    if (isPending) {
      throw new BadRequestException("Friend request already pending");
    }

    // Check if already friends
    const isFriends = await this.friendsService.isFriends(user.id, receiver.id);
    if (isFriends) throw new BadRequestException("You already friends");

    // Check if trying to add yourself
    if (user.id === receiver.id)
      throw new BadRequestException("Can't add yourself");

    const friendRequest = await this.prisma.friendRequest.create({
      data: {
        senderId: user.id,
        receiverId: receiver.id,
        status: "pending",
      },
      include: {
        receiver: {
          select: {
            ...userSelectedFields,
          },
        },
        sender: {
          select: {
            ...userSelectedFields,
          },
        },
      },
    });

    return friendRequest;
  }

  async cancel(user: User, id: string): Promise<FriendRequest> {
    const friendRequest = await this.findById(id);
    if (!friendRequest)
      throw new BadRequestException(`Friend request with ${id} doesn't exist`);
    if (friendRequest.senderId !== user.id)
      throw new BadRequestException("Can't cancel somebody elses request");
    await this.prisma.friendRequest.delete({
      where: {
        id,
      },
    });
    return friendRequest;
  }

  async accept(user: User, id: string) {
    const friendRequest = await this.findById(id);
    if (!friendRequest)
      throw new BadRequestException(
        `Friend request with id ${id} doesn't exist`,
      );
    if (friendRequest.receiverId !== user.id)
      throw new BadRequestException("Can't accept somebody elses request");
    if (friendRequest.status !== "pending")
      throw new BadRequestException("Friend request expired");
    const [updatedFriendRequest, newFriend] = await this.prisma.$transaction([
      this.prisma.friendRequest.update({
        where: {
          id,
        },
        data: {
          status: "accepted",
        },
        include: {
          receiver: {
            select: {
              ...userSelectedFields,
            },
          },
          sender: {
            select: {
              ...userSelectedFields,
            },
          },
        },
      }),
      this.prisma.friend.create({
        data: {
          senderId: friendRequest.senderId,
          receiverId: friendRequest.receiverId,
        },
        include: {
          receiver: {
            select: {
              ...userSelectedFields,
            },
          },
          sender: {
            select: {
              ...userSelectedFields,
            },
          },
        },
      }),
    ]);
    return {
      newFriend,
      friendRequest: updatedFriendRequest,
    };
  }

  async reject(user: User, id: string): Promise<FriendRequest> {
    const friendRequest = await this.findById(id);
    if (!friendRequest)
      throw new BadRequestException(
        `Friend request with id ${id} doesn't exist`,
      );
    if (friendRequest.receiverId !== user.id)
      throw new BadRequestException("Can't reject somebody elses request");
    if (friendRequest.status !== "pending")
      throw new BadRequestException("Friend request expired");
    const updatedFriendRequest = await this.prisma.friendRequest.update({
      where: {
        id,
      },
      data: {
        status: "rejected",
      },
    });
    return updatedFriendRequest;
  }

  async getFriendRequests(id: string) {
    const friendRequests = await this.prisma.friendRequest.findMany({
      where: {
        OR: [
          {
            senderId: id,
            status: "pending",
          },
          {
            receiverId: id,
            status: "pending",
          },
        ],
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
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
    const incomingFriendRequests = friendRequests.filter(
      (fr) => fr.senderId !== id,
    );
    const outgoingFriendRequests = friendRequests.filter(
      (fr) => fr.senderId === id,
    );
    return {
      friendRequests,
      incomingFriendRequests,
      outgoingFriendRequests,
    };
  }

  isPending(userOneId: string, userTwoId: string): Promise<FriendRequest> {
    return this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            receiverId: userOneId,
            senderId: userTwoId,
            status: "pending",
          },
          {
            receiverId: userTwoId,
            senderId: userOneId,
            status: "pending",
          },
        ],
      },
    });
  }

  findById(id: string): Promise<FriendRequest> {
    return this.prisma.friendRequest.findFirst({
      where: {
        id,
      },
      include: {
        receiver: {
          select: {
            ...userSelectedFields,
          },
        },
        sender: {
          select: {
            ...userSelectedFields,
          },
        },
      },
    });
  }
}

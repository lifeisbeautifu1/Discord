import { Injectable } from "@nestjs/common";
import { MessageNotification } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateNotificationDto } from "./dto/CreateNotificationDto";

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  getNotifications(userId: string) {
    return this.prisma.messageNotification.findMany({
      where: {
        userId,
      },
    });
  }

  clearNotifications(userId: string, conversationId: string) {
    return this.prisma.messageNotification.deleteMany({
      where: {
        userId,
        conversationId,
      },
    });
  }

  async createNotification(dto: CreateNotificationDto) {
    const conversationParticipants =
      await this.prisma.conversationParticipant.findMany({
        where: {
          conversationId: dto.conversationId,
          NOT: {
            userId: dto.userId,
          },
        },
      });
    const notifications: Array<MessageNotification> = [];
    for (let cp of conversationParticipants) {
      const notification = await this.prisma.messageNotification.create({
        data: {
          ...dto,
          userId: cp.userId,
        },
      });
      notifications.push(notification);
    }
    return notifications;
  }
}

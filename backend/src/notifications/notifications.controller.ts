import { Controller, Delete, Get, Param, UseGuards } from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { User } from "@prisma/client";
import { AuthenticatedGuard } from "src/auth/utils/guards";
import { Routes } from "src/utils/constants";
import { GetUser } from "src/utils/decorators";
import { NotificationsService } from "./notifications.service";

@UseGuards(AuthenticatedGuard)
@Controller(Routes.NOTIFICATIONS)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getAllNotifications(@GetUser() user: User) {
    return await this.notificationsService.getNotifications(user.id);
  }

  @SkipThrottle()
  @Delete(":conversationId")
  async clearNotifications(
    @GetUser() user: User,
    @Param(":conversationId") conversationId: string,
  ) {
    return await this.notificationsService.clearNotifications(
      user.id,
      conversationId,
    );
  }
}

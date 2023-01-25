import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { EventsModule } from "./events/events.module";
import { FriendRequestsModule } from "./friend-requests/friend-requests.module";
import { FriendsModule } from "./friends/friends.module";
import { MailgunModule } from "./mailgun/mailgun.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UploadModule } from "./upload/upload.module";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { UserModule } from "./user/user.module";
import { GatewayModule } from "./gateway/gateway.module";
import { ConversationsModule } from "./conversations/conversations.module";
import { MessagesModule } from "./messages/messages.module";
import { NotificationsModule } from "./notifications/notifications.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 10,
    }),
    EventEmitterModule.forRoot(),
    EventsModule,
    GatewayModule,
    AuthModule,
    PrismaModule,
    MailgunModule,
    NotificationsModule,
    UserModule,
    UploadModule,
    FriendRequestsModule,
    FriendsModule,
    ConversationsModule,
    MessagesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

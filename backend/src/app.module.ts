import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { FriendRequestsModule } from "./friend-requests/friend-requests.module";
import { FriendsModule } from "./friends/friends.module";
import { MailgunModule } from "./mailgun/mailgun.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UploadModule } from "./upload/upload.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    MailgunModule,
    UserModule,
    UploadModule,
    FriendRequestsModule,
    FriendsModule,
  ],
  providers: [],
})
export class AppModule {}

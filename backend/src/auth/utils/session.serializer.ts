import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { userSelectedFields } from "src/utils/constants/userSelectedFields";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private prisma: PrismaService) {
    super();
  }
  async serializeUser(user: User, done: Function) {
    // Save user id to session
    done(null, user.id);
  }
  // Append user data from user id stored in session
  async deserializeUser(payload: string, done: Function) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload,
      },
      select: {
        ...userSelectedFields,
        // password: true,
      },
    });
    // Will be appended to req.user
    done(null, user);
  }
}

import { Injectable, BadRequestException } from "@nestjs/common";
import { CreateUserDto } from "src/user/dtos/createUser.dto";
import { UserService } from "src/user/user.service";
import { ConfigService } from "@nestjs/config";
import { MailgunService } from "src/mailgun/mailgun.service";
import { User } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { Redis } from "ioredis";
import * as argon from "argon2";
import { redisClient } from "src/main";

@Injectable()
export class AuthService {
  private redis: Redis;

  constructor(
    private userService: UserService,
    private config: ConfigService,
    private mailgun: MailgunService,
  ) {
    this.redis = redisClient;
  }

  async register(dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }

  async sendEmailToResetPassword(email: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!user)
      throw new BadRequestException({
        email: "Email does not exist",
      });

    const prefix = this.config.get("PREFIX");

    const token = uuid();

    await this.redis.set(
      prefix + token,
      user.id,
      "EX",
      1000 * 60 * 60 * 24 * 3,
    ); // 3 days

    this.mailgun.sendPasswordReset(user, token);
  }

  async sendEmailVerification(user: Partial<User>) {
    const { emailVerified } = await this.userService.findUserByEmail(
      user.email,
    );

    if (emailVerified) {
      throw new BadRequestException({
        token: "Email verified already",
      });
    }

    const prefix = this.config.get("PREFIX");

    const token = uuid();

    await this.redis.set(
      prefix + token,
      user.id,
      "EX",
      1000 * 60 * 60 * 24 * 3,
    ); // 3 days

    this.mailgun.sendEmailVerification(user, token);
  }

  async verifyEmail(token: string) {
    const key = this.config.get("PREFIX") + token;

    const userId = await this.redis.get(key);

    if (!userId)
      throw new BadRequestException({
        token: "Token invalid or expired",
      });

    await this.userService.updateUserEmailVerify(userId);

    await this.redis.del(key);
  }

  async resetPassword(password: string, token: string) {
    if (password.length < 6) {
      throw new BadRequestException({
        password: "Must be 6 or more in length.",
      });
    }
    const key = this.config.get("PREFIX") + token;

    const userId = await this.redis.get(key);

    if (!userId)
      throw new BadRequestException({
        token: "Invalid token",
      });

    const user = await this.userService.updatePassword(password, userId);

    await this.redis.del(key);

    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!user)
      throw new BadRequestException({
        email: "Email or password is invalid",
        password: "Email or password is invalid",
      });

    const isMatch = await argon.verify(user.password, password);

    if (!isMatch)
      throw new BadRequestException({
        email: "Email or password is invalid",
        password: "Email or password is invalid",
      });

    delete user.password;

    return user;
  }
}

import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dtos/createUser.dto";
import * as argon from "argon2";
import { use } from "passport";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const existingEmail = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingEmail) {
      throw new BadRequestException({
        email: "Email already taken",
      });
    }

    const existingUsername = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });

    if (existingUsername) {
      throw new BadRequestException({
        username: "Username already taken",
      });
    }

    const hash = await argon.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLocaleLowerCase(),
        password: hash,
        username: dto.username,
      },
      select: {
        id: true,
        email: true,
        username: true,
        imageUrl: true,
        emailVerified: true,
      },
    });

    return user;
  }

  async updateUserEmailVerify(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user)
      throw new BadRequestException({
        token: "User does not exist",
      });

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        emailVerified: new Date().toISOString(),
      },
    });
  }

  async updatePassword(password: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        imageUrl: true,
        emailVerified: true,
      },
    });
    if (!user)
      throw new BadRequestException({
        token: "Invalid token",
      });

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: await argon.hash(password),
      },
    });

    return user;
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        imageUrl: true,
        emailVerified: true,
      },
    });
  }
}

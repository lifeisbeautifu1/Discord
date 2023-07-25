import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dtos/createUser.dto";
import * as argon from "argon2";
import { uniqueUsername } from "src/utils/generatesUsername";
import { userSelectedFields } from "src/utils/constants/userSelectedFields";

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

    const hash = await argon.hash(dto.password);

    const usersWithTheSameUsername = await this.prisma.user.findMany({
      where: {
        username: dto.username.toLocaleLowerCase(),
      },
    });

    if (usersWithTheSameUsername.length >= 9999) {
      throw new BadRequestException({
        username: "Username already taken",
      });
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLocaleLowerCase(),
        password: hash,
        username: dto.username,
        u_name: uniqueUsername(
          dto.username,
          usersWithTheSameUsername.length + 1,
        ),
      },
      select: {
        id: true,
        email: true,
        username: true,
        u_name: true,
        image: true,
        emailVerified: true,
        peer: true,
      },
    });

    const peer = await this.prisma.peer.create({
      data: {
        userId: user?.id,
      },
    });
    user.peer = peer;

    return user;
  }

  async updateUserEmailVerify(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        peer: true,
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

  // Might break!
  async updatePassword(password: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
        u_name: true,
        image: true,
        emailVerified: true,
        peer: true,
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
        ...userSelectedFields,
        password: true,
      },
    });
  }

  async findUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        ...userSelectedFields,
      },
    });
  }

  async findUserByUName(u_name: string) {
    return await this.prisma.user.findUnique({
      where: {
        u_name,
      },
      select: {
        ...userSelectedFields,
      },
    });
  }
}

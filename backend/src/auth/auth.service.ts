import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SignInDto, SignUpDto } from "./dto";
import * as argon from "argon2";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signIn(dto: SignInDto) {}

  async signUp(dto: SignUpDto) {
    const hash = await argon.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        username: dto.username,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    if (!user)
      throw new BadRequestException(`User with email: ${email} not found`);

    const isMatch = await argon.verify(user.password, password);

    if (!isMatch) throw new BadRequestException("Incorrect password");

    return user;
  }
}

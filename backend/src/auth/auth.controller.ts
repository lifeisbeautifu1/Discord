import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Session as GetSession,
  Get,
  UseFilters,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { Session } from "express-session";
import { GetUser } from "src/utils/decorators";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/user/dtos/createUser.dto";
import { SignInDto } from "./dtos/signIn.dto";
import { LocalGuard, AuthenticatedGuard } from "./utils/guards";
import { HttpExceptionFilter } from "src/utils/exceptions/http-exception.filter";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseFilters(HttpExceptionFilter)
  @Post("register")
  async register(@Body() dto: CreateUserDto, @GetSession() session: any) {
    const user = await this.authService.register(dto);
    session.passport = {
      user: user.id,
    };
    return user;
  }

  @Get("logout")
  @HttpCode(204)
  logout(@GetSession() session: Session) {
    session.destroy(() => {});
  }

  @UseGuards(AuthenticatedGuard)
  @Get("me")
  getMe(@GetUser() user: User) {
    return user;
  }

  @UseGuards(LocalGuard)
  @UseFilters(HttpExceptionFilter)
  @HttpCode(200)
  @Post("login")
  login(@Body() dto: SignInDto, @GetUser() user: User) {
    return user;
  }
}

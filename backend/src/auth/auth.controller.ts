import { Controller, Post, Body, HttpCode, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto, SignUpDto } from "./dto";
import { LocalGuard } from "./guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @UseGuards(LocalGuard)
  @HttpCode(200)
  @Post("signin")
  signIn(@Body() dto: SignInDto) {
    return {
      message: "logged in",
    };
    // return this.authService.signIn(dto);
  }
}

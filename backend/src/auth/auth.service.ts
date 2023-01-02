import { Injectable, BadRequestException } from "@nestjs/common";
import { CreateUserDto } from "src/user/dtos/createUser.dto";
import * as argon from "argon2";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signUp(dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) throw new BadRequestException("Incorrect email");

    const isMatch = await argon.verify(user.password, password);

    if (!isMatch) throw new BadRequestException("Incorrect password");

    delete user.password;

    return user;
  }
}

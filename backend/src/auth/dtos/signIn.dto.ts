import { IsEmail, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  password: string;
}

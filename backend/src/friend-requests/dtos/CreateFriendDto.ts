import { IsNotEmpty, IsString } from "class-validator";

export class SendFriendRequestDto {
  @IsNotEmpty()
  @IsString()
  u_name: string;
}

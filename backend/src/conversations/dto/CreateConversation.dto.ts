import {
  IsArray,
  ArrayMinSize,
  ArrayUnique,
  ArrayNotContains,
} from "class-validator";

export class CreateConversationDto {
  @IsArray()
  @ArrayMinSize(2)
  @ArrayUnique()
  @ArrayNotContains([""], {
    message: "Shouldn't contain empty strings",
  })
  participantsIds: Array<string>;
}

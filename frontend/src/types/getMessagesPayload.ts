import { Message } from ".";

export type GetMessagesPayload = {
  more: boolean;
  messages: Array<Message>;
};

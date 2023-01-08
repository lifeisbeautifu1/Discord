import { Message } from "postcss";
import { Conversation, Friend, FriendRequest } from ".";

export type OnFriendRequestAcceptedData = {
  newFriend: Friend;
  friendRequest: FriendRequest;
};

export type OnMessageData = {
  message: Message;
  conversation: Conversation;
};

import { Conversation, Friend, FriendRequest, Message } from ".";

export type OnFriendRequestAcceptedData = {
  newFriend: Friend;
  friendRequest: FriendRequest;
};

export type OnMessageData = {
  message: Message;
  conversation: Conversation;
};

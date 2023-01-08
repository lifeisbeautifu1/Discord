import { Friend, Conversation } from "../types";

export const toShowFromFriend = (id: string, friend: Friend) => {
  return friend.receiverId === id ? friend.sender : friend.receiver;
};

export const toShowFromConversation = (
  id: string,
  conversation: Conversation
) => {
  return conversation.creatorId === id
    ? conversation.recipient
    : conversation.creator;
};

export const isOnline = (
  userId: string,
  id: string,
  onlineFriends: Array<Friend>
) =>
  onlineFriends
    .map((friend) => toShowFromFriend(userId, friend)?.id)
    .includes(id);

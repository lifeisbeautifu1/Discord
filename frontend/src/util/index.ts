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

export const sameDay = (d1: Date, d2: Date) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

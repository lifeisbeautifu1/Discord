import { Friend, Conversation } from "../types";

export const toShowFromFriend = (id: string, friend: Friend) => {
  return friend.receiverId === id ? friend.sender : friend.receiver;
};

export const toShowFromConversation = (
  id: string,
  conversation: Conversation
) => {
  const index = conversation.participants.findIndex(
    (participant) => participant?.user?.id !== id
  );
  return conversation.participants[index].user;
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

export const observeElement = (element: HTMLElement) => {
  if (!element) return;
  console.log("creating observe event");
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        console.log("reached last element");

        observer.unobserve(element);
      }
    },
    { threshold: 1 }
  );
  observer.observe(element);
};

import { Friend, FriendRequest } from ".";

export type OnFriendRequestAcceptedData = {
  newFriend: Friend;
  friendRequest: FriendRequest;
};

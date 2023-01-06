import axios from "axios";
import { Friend, FriendRequest } from "../../types";

export type GetFriendRequestsData = {
  friendRequests: Array<FriendRequest>;
  incomingFriendRequests: Array<FriendRequest>;
  outgoingFriendRequests: Array<FriendRequest>;
};

const sendFriendRequest = async (u_name: string) => {
  const { data } = await axios.post<FriendRequest>("/friends/requests", {
    u_name,
  });
  return data;
};

const getFriendRequests = async () => {
  const { data } = await axios.get<GetFriendRequestsData>("/friends/requests");
  return data;
};

const getFriends = async () => {
  const { data } = await axios.get<Array<Friend>>("/friends");
  return data;
};

const deleteFriend = async (id: string) => {
  const { data } = await axios.delete<Friend>(`/friends/${id}/delete`);
  return data;
};

const cancelFriendRequest = async (id: string) => {
  const { data } = await axios.delete<FriendRequest>(
    `/friends/requests/${id}/cancel`
  );
  return data;
};

const rejectFriendRequest = async (id: string) => {
  const { data } = await axios.patch<FriendRequest>(
    `/friends/requests/${id}/reject`
  );
  return data;
};

const acceptFriendRequest = async (id: string) => {
  const { data } = await axios.patch<{
    newFriend: Friend;
    friendRequest: FriendRequest;
  }>(`/friends/requests/${id}/accept`);
  return data;
};

export default {
  sendFriendRequest,
  getFriendRequests,
  cancelFriendRequest,
  rejectFriendRequest,
  acceptFriendRequest,
  getFriends,
  deleteFriend,
};

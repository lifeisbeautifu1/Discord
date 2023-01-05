import axios from "axios";
import { FriendRequest } from "../../types";

const sendFriendRequest = async (u_name: string) => {
  const { data } = await axios.post<FriendRequest>("/friends/requests", {
    u_name,
  });
  return data;
};

const getFriendRequests = async () => {
  const { data } = await axios.get<FriendRequest[]>("/friends/requests");
  return data;
};

export default {
  sendFriendRequest,
  getFriendRequests,
};

import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { useSocketContext } from "../contexts/SocketContext";
import {
  addFriend,
  addIncomingFriendRequest,
  removeIncomingFriendRequest,
  removeOutgoingFriendRequest,
} from "../features/friends/friends";
import { FriendRequest } from "../types";
import { OnFriendRequestAcceptedData } from "../types/onFriendRequestAcceptedData";

export function useSubscribeToFriendRequests() {
  const socket = useSocketContext();

  const dispatch = useAppDispatch();

  useEffect(() => {
    socket?.on("onFriendRequestReceived", (data: FriendRequest) => {
      console.log("someone sent me friend request");
      dispatch(addIncomingFriendRequest(data));
    });

    socket?.on(
      "onFriendRequestAccepted",
      ({ newFriend, friendRequest }: OnFriendRequestAcceptedData) => {
        console.log("someone accepted my friend request");
        dispatch(removeOutgoingFriendRequest(friendRequest));
        dispatch(addFriend(newFriend));
        socket?.emit("getOnlineFriends");
      }
    );

    socket?.on("onFriendRequestRejected", (data: FriendRequest) => {
      console.log("someone declined my friend request");
      dispatch(removeOutgoingFriendRequest(data));
    });

    socket?.on("onFriendRequestCancelled", (data: FriendRequest) => {
      console.log("someone cancelled friend request to me");
      dispatch(removeIncomingFriendRequest(data));
    });

    return () => {
      socket?.off("onFriendRequestReceived");
      socket?.off("onFriendRequestAccepted");
      socket?.off("onFriendRequestRejected");
      socket?.off("onFriendRequestCancelled");
    };
  }, [socket]);
}

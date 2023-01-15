import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { useSocketContext } from "../contexts/SocketContext";
import {
  removeFriend,
  setOfflineFriends,
  setOnlineFriends,
} from "../features/friends/friends";
import { Friend } from "../types";

export function useSubscribeToFriends() {
  const socket = useSocketContext();

  const dispatch = useAppDispatch();

  useEffect(() => {
    socket?.emit("getOnlineFriends");

    socket?.on("onFriendRemoved", (data: Friend) => {
      console.log("someone deleted me from friends");
      dispatch(removeFriend(data));
      socket?.emit("getOnlineFriends");
    });

    socket?.on("getOnlineFriends", (data: Array<Friend>) => {
      console.log("Received online friends: ", data);
      dispatch(setOnlineFriends(data));
      dispatch(setOfflineFriends());
    });

    return () => {
      socket?.off("onFriendRemoved");
      socket?.off("getOnlineFriends");
    };
  }, [socket]);
}

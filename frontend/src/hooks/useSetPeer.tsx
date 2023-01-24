import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUser } from "../features/auth/auth";
import Peer from "peerjs";
import { setPeer } from "../features/call/callSlice";

export const useSetPeer = () => {
  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user) return;
    const newPeer = new Peer(user.peer.id, {
      config: {
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
          {
            urls: "stun:stun1.l.google.com:19302",
          },
        ],
      },
    });
    dispatch(setPeer(newPeer));
  }, [user]);
};

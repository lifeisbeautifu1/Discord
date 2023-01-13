import { useEffect } from "react";

import { useAppDispatch } from "../app/hooks";
import { useSocketContext } from "../contexts/SocketContext";
import { resetState } from "../features/call/callSlice";

export function useVideoCallRejected() {
  const socket = useSocketContext();

  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.on("onVideoCallRejected", (data) => {
      console.log("receiver rejected the call ", data.receiver);
      dispatch(resetState());
    });

    return () => {
      socket.off("onVideoCallRejected");
    };
  }, []);
}

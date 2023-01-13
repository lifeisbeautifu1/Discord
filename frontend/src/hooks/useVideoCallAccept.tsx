import { useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  setIsCallInProgress,
  setIsReceivingCall,
  setConnection,
  setCall,
  setActiveConversationId,
} from "../features/call/callSlice";
import { useSocketContext } from "../contexts/SocketContext";
import { selectUser } from "../features/auth/auth";
import { RootState } from "../app/store";
import { AcceptedCallPayload } from "../types";

/**
 * This useEffect will only trigger logic for the person who initiated
 * the call. It will start a peer connection with the person who already
 * accepted the call.
 */
export function useVideoCallAccept() {
  const user = useAppSelector(selectUser);

  const socket = useSocketContext();

  const dispatch = useAppDispatch();

  const { peer, localStream } = useAppSelector(
    (state: RootState) => state.call
  );

  useEffect(() => {
    socket.on("onVideoCallAccept", (data: AcceptedCallPayload) => {
      console.log("videoCallAccepted");
      dispatch(setIsCallInProgress(true));
      dispatch(setIsReceivingCall(false));
      dispatch(setActiveConversationId(data.conversation.id));
      if (!peer) return console.log("No peer....");
      if (data?.caller?.id === user!.id) {
        console.log(peer.id);
        if (data.acceptor) {
          const connection = peer.connect(data.acceptor.peer.id);
          dispatch(setConnection(connection));
          if (!connection) return console.log("No connection");
          if (localStream) {
            console.log("local stream for caller exists!");
            console.log("My local stream:", localStream.id);
            const newCall = peer.call(data.acceptor.peer.id, localStream);
            dispatch(setCall(newCall));
          }
        }
      }
    });
    return () => {
      socket.off("onVideoCallAccept");
    };
  }, [localStream, peer]);
}

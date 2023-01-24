import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  setIsCallInProgress,
  setIsReceivingCall,
  setConnection,
  setCall,
  setActiveConversationId,
  setVideoEnabled,
  setMicrophoneEnabled,
} from "../features/call/callSlice";
import { useSocketContext } from "../contexts/SocketContext";
import { selectUser } from "../features/auth/auth";
import { AcceptedCallPayload } from "../types";
import { useNavigate } from "react-router-dom";

/**
 * This useEffect will only trigger logic for the person who initiated
 * the call. It will start a peer connection with the person who already
 * accepted the call.
 */
export function useVideoCallAccepted() {
  const user = useAppSelector(selectUser);

  const socket = useSocketContext();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { peer, localStream } = useAppSelector((state) => state.call);

  useEffect(() => {
    peer?.on("open", function (id) {
      console.log("open");
      // Workaround for peer.reconnect deleting previous id
      if (peer.id === null) {
        console.log("Received null id from peer open");
      } else {
        console.log(peer.id);
      }

      console.log("ID: " + peer.id);
    });
    peer?.on("disconnected", function () {
      console.log("Connection lost. Please reconnect");

      // peer.reconnect();
    });
    peer?.on("error", function (err) {
      console.log(err);
      // alert("" + err);
    });
  }, [peer]);

  useEffect(() => {
    socket.on("onVideoCallAccepted", (data: AcceptedCallPayload) => {
      console.log("videoCallAccepted");
      dispatch(setIsCallInProgress(true));
      dispatch(setIsReceivingCall(false));
      dispatch(setActiveConversationId(data.conversation.id));
      navigate("/channels/@me/" + data.conversation.id);
      if (!peer) return console.log("No peer....");

      // dispatch(setVideoEnabled(true));
      dispatch(setMicrophoneEnabled(true));

      if (data?.caller?.id === user!.id) {
        console.log(peer?.id);

        if (data.acceptor) {
          const connection = peer.connect(data.acceptor?.peer?.id);

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
      socket.off("onVideoCallAccepted");
    };
  }, [localStream, peer, user]);
}

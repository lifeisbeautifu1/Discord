import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  setCaller,
  setReceiver,
  setIsReceivingCall,
  setCallType,
  setActiveConversationId,
  setUpdateRemoteStream,
} from "../features/call/callSlice";
import { useSocketContext } from "../contexts/SocketContext";
import { CallPayload } from "../types/";
import { RootState } from "../app/store";

export function useVideoCall() {
  const socket = useSocketContext();

  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);

  const { isReceivingCall, updateRemoteStream } = useAppSelector(
    (state: RootState) => state.call
  );

  useEffect(() => {
    socket.on("onVideoCall", (data: CallPayload) => {
      console.log("receiving video call....");
      console.log(data);
      if (isReceivingCall) return;
      dispatch(setCaller(data.caller));
      dispatch(setActiveConversationId(data.conversationId));
      dispatch(setReceiver(user!));
      dispatch(setIsReceivingCall(true));
      dispatch(setCallType("video"));
    });

    socket?.on("onUpdateRemoteStream", () => {
      dispatch(setUpdateRemoteStream(!updateRemoteStream));
    });

    return () => {
      socket.off("onVideoCall");
      socket.off("onUpdateRemoteStream");
    };
  }, [isReceivingCall, user, updateRemoteStream]);
}

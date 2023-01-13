import { useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  setCaller,
  setReceiver,
  setIsReceivingCall,
  setCallType,
} from "../features/call/callSlice";
import { useSocketContext } from "../contexts/SocketContext";
import { CallPayload } from "../types/";
import { selectUser } from "../features/auth/auth";
import { RootState } from "../app/store";

export function useVideoCall() {
  const socket = useSocketContext();

  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);

  const { isReceivingCall } = useAppSelector((state: RootState) => state.call);

  useEffect(() => {
    socket.on("onVideoCall", (data: CallPayload) => {
      console.log("receiving video call....");
      console.log(data);
      if (isReceivingCall) return;
      dispatch(setCaller(data.caller));
      dispatch(setReceiver(user!));
      dispatch(setIsReceivingCall(true));
      dispatch(setCallType("video"));
    });

    return () => {
      socket.off("onVideoCall");
    };
  }, [isReceivingCall]);
}

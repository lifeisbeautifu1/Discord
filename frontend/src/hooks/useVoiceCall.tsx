import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  setCaller,
  setReceiver,
  setIsReceivingCall,
  setCallType,
} from "../features/call/callSlice";
import { useSocketContext } from "../contexts/SocketContext";
import { selectUser } from "../features/auth/auth";
import { RootState } from "../app/store";
import { CallPayload } from "../types";

export function useVoiceCall() {
  const socket = useSocketContext();

  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);

  const { isReceivingCall } = useAppSelector((state: RootState) => state.call);

  useEffect(() => {
    socket.on("onVoiceCall", (data: CallPayload) => {
      console.log("receiving voice call....");
      console.log(data);
      if (isReceivingCall) return;
      dispatch(setCaller(data.caller));
      dispatch(setReceiver(user!));
      dispatch(setIsReceivingCall(true));
      dispatch(setCallType("audio"));
    });

    return () => {
      socket.off("onVoiceCall");
    };
  }, [isReceivingCall]);
}

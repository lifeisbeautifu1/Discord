import { useEffect } from "react";
import { Notification } from "../types";
import { useAppDispatch } from "../app/hooks";
import { useSocketContext } from "../contexts/SocketContext";
import { addNotification } from "../features/conversations/conversations";

export const useSubscribeToNotifications = () => {
  const socket = useSocketContext();

  const dispatch = useAppDispatch();

  useEffect(() => {
    socket?.on("onMessageNotifications", (payload: Notification) => {
      dispatch(addNotification(payload));
    });
    return () => {
      socket?.off("onMessageNotification");
    };
  }, [socket]);
};

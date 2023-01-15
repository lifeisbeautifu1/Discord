import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { useSocketContext } from "../contexts/SocketContext";
import { addConversation } from "../features/conversations/conversations";
import { Conversation } from "../types";

export function useSubscribeToConversations() {
  const socket = useSocketContext();

  const dispatch = useAppDispatch();

  useEffect(() => {
    socket?.on("onConversation", (data: Conversation) => {
      console.log("just got new conversation");
      dispatch(addConversation(data));
    });

    return () => {
      socket.off("onConversation");
    };
  }, [socket]);
}

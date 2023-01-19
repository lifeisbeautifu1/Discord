import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { useSocketContext } from "../contexts/SocketContext";
import {
  addMessage,
  removeMessage,
  setUserTyping,
  updateMessage,
} from "../features/conversations/conversations";
import { Message } from "../types";
import { TypingPayload } from "../types/TypingPayload";

export const useSubscribeToMessages = () => {
  const socket = useSocketContext();

  const dispatch = useAppDispatch();

  useEffect(() => {
    socket?.on("onMessage", (message: Message) => {
      console.log("got new message!");
      dispatch(addMessage(message));
    });

    socket?.on("onTypingStart", (payload: TypingPayload) => {
      dispatch(
        setUserTyping({
          isTyping: true,
          ...payload,
        })
      );
    });

    socket?.on("onTypingStop", (payload: TypingPayload) => {
      dispatch(
        setUserTyping({
          isTyping: false,
          ...payload,
        })
      );
    });

    socket?.on("onMessageDelete", (messageId: string) => {
      console.log("message got deleted");
      dispatch(removeMessage(messageId));
    });

    socket?.on("onMessageUpdate", (payload: Message) => {
      console.log("message got updated");
      dispatch(updateMessage(payload));
    });
    return () => {
      socket?.off("onMessage");
      socket?.off("onMessageDelete");
      socket?.off("onMessageUpdate");
      socket?.off("onTypingStart");
      socket?.off("onTypingEnd");
    };
  }, [socket]);
};

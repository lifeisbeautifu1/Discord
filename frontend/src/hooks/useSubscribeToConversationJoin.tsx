import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { useSocketContext } from "../contexts/SocketContext";
import {
  getConversation,
  getMessages,
} from "../features/conversations/conversations.thunks";

export const useSubscribeToConversationJoin = () => {
  const socket = useSocketContext();

  const { id } = useParams();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getConversation(id));

      dispatch(getMessages(id));
      socket?.emit("onConversationJoin", id);
    }
    return () => {
      socket?.emit("onConversationLeave", id);
    };
  }, [id, socket]);
};

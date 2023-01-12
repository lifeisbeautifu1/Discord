import { HiGif } from "react-icons/hi2";
import {
  GiftIcon,
  EmojiHappyIcon,
  PlusCircleIcon,
} from "@heroicons/react/solid";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { sendMessage } from "../../features/conversations/conversations.thunks";
import { toShowFromConversation } from "../../util";
import { selectUser } from "../../features/auth/auth";
import { useSocketContext } from "../../contexts/SocketContext";

const ConversationInput = () => {
  const [content, setContent] = useState("");

  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>();

  const [typing, setTyping] = useState(false);

  const socket = useSocketContext();

  const { selectedConversation } = useAppSelector(
    (state) => state.conversations
  );

  const user = useAppSelector(selectUser);

  if (!user || !selectedConversation) return null;

  const toShow = toShowFromConversation(user.id, selectedConversation);

  const dispatch = useAppDispatch();

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);

    if (typing) {
      clearTimeout(timer);
      setTimer(
        setTimeout(() => {
          console.log("User stopped typing");
          socket.emit("typingStop", {
            conversationId: selectedConversation.id,
            userId: user.id,
          });
          setTyping(false);
        }, 2000)
      );
    } else {
      setTyping(true);
      socket.emit("typingStart", {
        conversationId: selectedConversation.id,
        userId: user.id,
      });
      setTimer(
        setTimeout(() => {
          console.log("User stopped typing");
          socket.emit("typingStop", {
            conversationId: selectedConversation.id,
            userId: user.id,
          });
          setTyping(false);
        }, 2000)
      );
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content.trim()) return;

    dispatch(sendMessage({ id: selectedConversation?.id!, content }));

    socket?.emit("typingStop", {
      conversationId: selectedConversation.id,
      userId: user.id,
    });

    setContent("");
  };

  const group = selectedConversation?.participants.length > 2;

  const groupName = selectedConversation?.participants
    .filter((p) => p.userId !== user?.id)
    .map((p) => p.user?.username)
    .join(", ");

  return (
    <form
      onSubmit={handleSubmit}
      className={`mx-4 -mt-2 flex items-center rounded-lg bg-d-input-bg px-4 py-2`}
    >
      <PlusCircleIcon className="mr-4 h-6 w-6 cursor-pointer text-d-gray hover:text-d-white" />
      <input
        value={content}
        onChange={handleTyping}
        type="text"
        autoFocus
        placeholder={`Message ${group ? groupName : `@${toShow?.username}`}`}
        className="mr-4 flex-1 resize-none border-none bg-transparent text-d-gray outline-none placeholder:text-d-gray/40"
      />
      <HiGif className="mr-2 h-7 w-7 cursor-pointer text-d-gray hover:text-d-white" />
      <GiftIcon className="mr-2 h-6 w-6 cursor-pointer text-d-gray hover:text-d-white" />
      <EmojiHappyIcon className="h-6 w-6 cursor-pointer text-d-gray hover:text-d-white" />
    </form>
  );
};

export default ConversationInput;

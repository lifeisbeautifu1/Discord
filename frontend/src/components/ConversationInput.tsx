import { HiGif } from "react-icons/hi2";
import {
  GiftIcon,
  EmojiHappyIcon,
  PlusCircleIcon,
} from "@heroicons/react/solid";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { sendMessage } from "../features/conversations/conversations.thunks";
import { toShowFromConversation } from "../util";
import { selectUser } from "../features/auth/auth";

const ConversationInput = () => {
  const [content, setContent] = useState("");

  const { selectedConversation } = useAppSelector(
    (state) => state.conversations
  );

  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content.trim()) return;

    dispatch(sendMessage({ id: selectedConversation?.id!, content }));

    setContent("");
  };

  if (!user || !selectedConversation) return null;

  const toShow = toShowFromConversation(user.id, selectedConversation);
  return (
    <form
      onSubmit={handleSubmit}
      className="mx-4 mb-6 -mt-2 flex items-center rounded-lg bg-d-input-bg px-4 py-2"
    >
      <PlusCircleIcon className="mr-4 h-6 w-6 cursor-pointer text-d-gray hover:text-d-white" />
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        type="text"
        autoFocus
        placeholder={`Message @${toShow?.username}`}
        className="mr-4 flex-1 resize-none border-none bg-transparent text-d-gray outline-none placeholder:text-d-gray/40"
      />
      <HiGif className="mr-2 h-7 w-7 cursor-pointer text-d-gray hover:text-d-white" />
      <GiftIcon className="mr-2 h-6 w-6 cursor-pointer text-d-gray hover:text-d-white" />
      <EmojiHappyIcon className="h-6 w-6 cursor-pointer text-d-gray hover:text-d-white" />
    </form>
  );
};

export default ConversationInput;

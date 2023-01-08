import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  ConversationHeader,
  ConversationInput,
  EmailVerifyPopup,
  SidebarFriends,
  MessageItem,
} from "../components";
import { format } from "date-fns";
import {
  addMessage,
  removeMessage,
  setError,
  updateMessage,
} from "../features/conversations/conversations";
import {
  getConversation,
  getMessages,
} from "../features/conversations/conversations.thunks";
import { toShowFromConversation } from "../util";
import { useSocketContext } from "../contexts/SocketContext";
import { OnMessageData } from "../types/onFriendRequestAcceptedData";
import { Message } from "../types";

const Conversation = () => {
  const { error, selectedConversation, messages } = useAppSelector(
    (state) => state.conversations
  );

  const { user } = useAppSelector((state) => state.auth);

  const socket = useSocketContext();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    socket?.on("onMessage", ({ message }: OnMessageData) => {
      console.log("got new message!");
      dispatch(addMessage(message));
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
    };
  }, [socket]);

  useEffect(() => {
    if (id) {
      dispatch(getConversation(id));
      dispatch(getMessages(id));
    }
  }, [id]);

  useEffect(() => {
    if (error) {
      navigate("/channels/@me");
      dispatch(setError(false));
    }
  }, [error]);

  if (error || !selectedConversation)
    return <div className="flex flex-1 bg-dark"></div>;

  const toShow = toShowFromConversation(user?.id!, selectedConversation);

  return (
    <div className="flex flex-1 flex-col">
      <EmailVerifyPopup />

      <div className="flex h-0 flex-1">
        <SidebarFriends />
        <div className="flex flex-1 flex-col bg-dark">
          <ConversationHeader />
          <main className="flex flex-1 flex-col overflow-hidden">
            <div className="mb-6 flex h-0 flex-1 flex-col-reverse overflow-y-scroll">
              <ul className="flex flex-col-reverse">
                {messages.map((message, index) => (
                  <MessageItem
                    index={index}
                    key={message.id}
                    message={message}
                  />
                ))}
              </ul>
              <div className="mt-4 mb-3 flex items-center px-4 text-xs font-semibold text-d-gray before:mr-1 before:block before:h-[1px] before:flex-1 before:bg-d-gray/10  after:ml-1 after:block after:h-[1px] after:flex-1 after:bg-d-gray/10">
                {format(
                  new Date(selectedConversation.createdAt),
                  "MMMM d, yyyy"
                )}
              </div>
              <div className="mt-4 flex items-center px-4 text-sm">
                <p className="text-d-gray">No servers in common</p>
                <div className="mx-4 h-1 w-1 rounded-full bg-[#4f545c]" />
                <button className="mr-2 rounded bg-[#4f545c] px-3.5 py-1 font-medium text-d-white transition ease-out hover:bg-[#686d73]">
                  Remove Friend
                </button>
                <button className="mr-2 rounded bg-[#4f545c] px-3.5 py-1 font-medium text-d-white transition ease-out hover:bg-[#686d73]">
                  Block
                </button>
              </div>
              <div className="p-4 pb-0">
                <img
                  src="/images/default-avatar.png"
                  width={80}
                  className="rounded-full"
                  height={80}
                  alt="avatar"
                />
                <h2 className="mt-2 text-[32px] font-bold text-d-white">
                  {toShow?.username}
                </h2>
                <p className="text-d-gray">
                  This is the beginning of your direct message history with{" "}
                  <span className="font-bold">@{toShow?.username}</span>.
                </p>
              </div>
            </div>
            <ConversationInput />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Conversation;

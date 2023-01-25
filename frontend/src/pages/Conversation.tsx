import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  ConversationHeader,
  ConversationInput,
  EmailVerifyPopup,
  SidebarFriends,
  MessageItem,
  TypingIndicator,
} from "../components";
import { format } from "date-fns";
import { setError } from "../features/conversations/conversations";
import { toShowFromConversation } from "../util";
import {
  useSubscribeToConversationJoin,
  useSubscribeToMessages,
} from "../hooks";
import {
  clearNotifications,
  getMessagesAfterMessage,
} from "../features/conversations/conversations.thunks";

const Conversation = () => {
  const {
    error,
    selectedConversation,
    messages,
    more,
    loading,
    lastMessage,
    loadingMessages,
  } = useAppSelector((state) => state.conversations);

  const { user } = useAppSelector((state) => state.auth);

  const [observedPost, setObservedPost] = useState("");

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const observeElement = useCallback(
    (element: HTMLElement) => {
      if (!element) return;
      console.log("creating observe event");
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            console.log("reached last element");
            if (more && !loadingMessages) {
              dispatch(
                getMessagesAfterMessage({
                  conversationId: selectedConversation?.id!,
                  messageId: lastMessage?.id!,
                })
              );
            }
            observer.unobserve(element);
          }
        },
        { threshold: 1 }
      );
      observer.observe(element);
    },
    [more, selectedConversation, lastMessage]
  );

  useEffect(() => {
    if (!lastMessage) return;
    if (lastMessage.id !== observedPost) {
      setObservedPost(lastMessage.id);

      observeElement(document.getElementById(lastMessage.id)!);
    }
  }, [lastMessage]);

  useSubscribeToMessages();
  useSubscribeToConversationJoin();

  useEffect(() => {
    if (error) {
      navigate("/channels/@me");
      dispatch(setError(false));
    }
  }, [error]);

  useEffect(() => {
    selectedConversation &&
      dispatch(clearNotifications(selectedConversation.id));
  }, [selectedConversation]);

  if (error || !selectedConversation)
    return <div className="flex flex-1 bg-dark"></div>;

  const toShow = toShowFromConversation(user?.id!, selectedConversation);

  const group = selectedConversation?.participants.length > 2;

  const groupName = selectedConversation?.participants
    .filter((p) => p.userId !== user?.id)
    .map((p) => p.user?.username)
    .join(", ");

  return (
    <div className="flex flex-1 flex-col">
      <EmailVerifyPopup />

      <div className="flex h-0 flex-1">
        <SidebarFriends />
        <div className="flex flex-1 flex-col bg-dark">
          <ConversationHeader />
          <main className="flex flex-1 flex-col overflow-hidden">
            <div className="mb-6 flex h-0 flex-1 flex-col-reverse overflow-y-scroll scrollbar-none">
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
              {!group && (
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
              )}
              <div className="p-4 pb-0">
                <img
                  src={
                    group
                      ? "/images/group-avatar.png"
                      : `https://cdn.discordapp.com/embed/avatars/${
                          parseInt(toShow?.u_name.split("#")[1]!) % 5
                        }.png`
                  }
                  width={80}
                  className="rounded-full"
                  height={80}
                  alt="avatar"
                />
                <h2 className="mt-2 text-[32px] font-bold text-d-white">
                  {group ? groupName : toShow?.username}
                </h2>
                <div className="text-d-gray">
                  {group ? (
                    <p>
                      Welcome to the beginning of the{" "}
                      <strong>{groupName}</strong> group.
                    </p>
                  ) : (
                    <p>
                      This is the beginning of your direct message history with{" "}
                      <strong>@{toShow?.username}</strong>.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <ConversationInput />
            <div
              className={`mx-4 mt-1 ${
                selectedConversation.participants.filter(
                  (participant) => participant.isTyping
                ).length > 0
                  ? "mb-3"
                  : "mb-5"
              }  flex items-center space-x-2`}
            >
              {selectedConversation.participants
                .filter((participant) => participant.isTyping)
                .map((participant) => (
                  <TypingIndicator
                    key={participant.id}
                    name={participant.user?.username}
                  />
                ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Conversation;

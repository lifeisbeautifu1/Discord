import { Message } from "../types";
import { EmojiHappyIcon } from "@heroicons/react/solid";
import { BsReplyFill, BsPinAngleFill } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { format, formatRelative } from "date-fns";
import { Tooltip } from "./";
import { useAppSelector } from "../app/hooks";
import { sameDay } from "../util";
import { useAppDispatch } from "../app/hooks";
import { deleteMessage } from "../features/conversations/conversations.thunks";
import { selectUser } from "../features/auth/auth";

type Props = {
  message: Message;
  index: number;
};

const MessageItem: React.FC<Props> = ({ message, index }) => {
  const { messages } = useAppSelector((state) => state.conversations);

  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  return (
    <>
      {index + 1 === messages.length ||
      (index + 1 < messages.length &&
        (messages[index + 1].authorId !== message.authorId ||
          new Date(messages[index].createdAt).getTime() -
            new Date(messages[index + 1].createdAt).getTime() >
            1000 * 60 * 10)) ? (
        <li
          className={`custom-group relative mt-4 flex items-start px-4 py-0.5 transition ease-out  hover:bg-[#2f3136]/50 ${
            index + 1 === messages.length ||
            !sameDay(
              new Date(message.createdAt),
              new Date(messages[index + 1].createdAt)
            )
              ? "mt-0"
              : "mt-4"
          }`}
        >
          <img
            src="/images/default-avatar.png"
            alt="avatar"
            className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
          />
          <div className="ml-4 flex flex-col justify-center">
            <div className="-mt-0.5 flex items-center space-x-2">
              <h2 className="font-semibold text-d-white">
                {message.author?.username}
              </h2>
              <p className="text-xs text-d-gray first-letter:capitalize">
                {formatRelative(new Date(message?.createdAt), new Date())}
              </p>
            </div>
            <p className="-mt-1 text-base text-[#dcddde]">{message.content}</p>
          </div>
          <div className="custom-hover display absolute right-4 -top-4 rounded border-[0.5px] border-gray-800 bg-dark text-xl text-d-gray shadow">
            <Tooltip text="Add Reaction">
              <div className="flex cursor-pointer items-center justify-center rounded-tl rounded-bl p-1.5 transition hover:bg-d-icon-bg-hover hover:text-d-white">
                <EmojiHappyIcon className="h-5 w-5" />
              </div>
            </Tooltip>

            <Tooltip text="Reply">
              <div className="flex cursor-pointer items-center justify-center p-1.5 transition hover:bg-d-icon-bg-hover hover:text-d-white">
                <BsReplyFill />
              </div>
            </Tooltip>
            <Menu
              as="div"
              className="relative flex items-center justify-center"
            >
              <Menu.Button>
                <Tooltip text="More">
                  <div className="flex cursor-pointer items-center justify-center rounded-tr rounded-br p-1.5 transition hover:bg-d-icon-bg-hover hover:text-d-white">
                    <BiDotsHorizontalRounded />
                  </div>
                </Tooltip>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute bottom-0 right-8 z-50 m-1 w-[200px] rounded bg-d-dark-black p-1.5 text-sm font-semibold text-d-gray">
                  {user?.id === message.authorId && (
                    <Menu.Item>
                      <div className="flex cursor-pointer items-center justify-between rounded p-2  transition hover:bg-brand hover:text-d-white">
                        <span>Edit</span>
                        <MdEdit className="text-lg" />
                      </div>
                    </Menu.Item>
                  )}
                  <Menu.Item>
                    <div className="flex cursor-pointer items-center justify-between rounded p-2  transition hover:bg-brand hover:text-d-white">
                      <span>Pin Message</span>
                      <BsPinAngleFill className="text-lg" />
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <div className="flex cursor-pointer items-center justify-between rounded p-2  transition hover:bg-brand hover:text-d-white">
                      <span>Reply</span>
                      <BsReplyFill className="text-lg" />
                    </div>
                  </Menu.Item>
                  {user?.id === message.authorId && (
                    <Menu.Item>
                      <div
                        onClick={() => {
                          dispatch(
                            deleteMessage({
                              conversationId: message.conversationId,
                              messageId: message.id,
                            })
                          );
                        }}
                        className="flex cursor-pointer items-center justify-between rounded p-2 text-red-500 transition hover:bg-red-500 hover:text-d-white"
                      >
                        <span>Delete Message</span>
                        <FaTrashAlt className="text-lg" />
                      </div>
                    </Menu.Item>
                  )}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </li>
      ) : (
        <li className="custom-group relative flex items-start px-4 py-0.5	transition ease-out hover:bg-[#2f3136]/50">
          <div className="flex h-[22px] w-10 flex-shrink-0 items-center justify-center">
            <span className="custom-hover display text-[10px] text-d-gray">
              {format(new Date(message?.createdAt), "p")}
            </span>
          </div>
          <div className="ml-4">
            <p className="-mt-0.5 text-base text-[#dcddde]">
              {message.content}
            </p>
          </div>
          <div className="custom-hover display absolute right-4 -top-4 rounded border-[0.5px] border-gray-800 bg-dark text-xl text-d-gray shadow">
            <Tooltip text="Add Reaction">
              <div className="flex cursor-pointer items-center justify-center rounded-tl rounded-bl p-1.5 transition hover:bg-d-icon-bg-hover hover:text-d-white">
                <EmojiHappyIcon className="h-5 w-5" />
              </div>
            </Tooltip>

            <Tooltip text="Reply">
              <div className="flex cursor-pointer items-center justify-center p-1.5 transition hover:bg-d-icon-bg-hover hover:text-d-white">
                <BsReplyFill />
              </div>
            </Tooltip>
            <Menu
              as="div"
              className="relative flex items-center justify-center"
            >
              <Menu.Button>
                <Tooltip text="More">
                  <div className="flex cursor-pointer items-center justify-center rounded-tr rounded-br p-1.5 transition hover:bg-d-icon-bg-hover hover:text-d-white">
                    <BiDotsHorizontalRounded />
                  </div>
                </Tooltip>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute bottom-0 right-8 z-50 m-1 w-[200px] rounded bg-d-dark-black p-1.5 text-sm font-semibold text-d-gray">
                  {user?.id === message.authorId && (
                    <Menu.Item>
                      <div className="flex cursor-pointer items-center justify-between rounded p-2  transition hover:bg-brand hover:text-d-white">
                        <span>Edit</span>
                        <MdEdit className="text-lg" />
                      </div>
                    </Menu.Item>
                  )}

                  <Menu.Item>
                    <div className="flex cursor-pointer items-center justify-between rounded p-2  transition hover:bg-brand hover:text-d-white">
                      <span>Pin Message</span>
                      <BsPinAngleFill className="text-lg" />
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <div className="flex cursor-pointer items-center justify-between rounded p-2  transition hover:bg-brand hover:text-d-white">
                      <span>Reply</span>
                      <BsReplyFill className="text-lg" />
                    </div>
                  </Menu.Item>
                  {user?.id === message.authorId && (
                    <Menu.Item>
                      <div
                        onClick={() => {
                          dispatch(
                            deleteMessage({
                              conversationId: message.conversationId,
                              messageId: message.id,
                            })
                          );
                        }}
                        className="flex cursor-pointer items-center justify-between rounded p-2 text-red-500 transition hover:bg-red-500 hover:text-d-white"
                      >
                        <span>Delete Message</span>
                        <FaTrashAlt className="text-lg" />
                      </div>
                    </Menu.Item>
                  )}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </li>
      )}
      {index + 1 !== messages.length &&
        !sameDay(
          new Date(message.createdAt),
          new Date(messages[index + 1].createdAt)
        ) && (
          <div className="mt-3 mb-2 flex items-center px-4 text-xs font-semibold text-d-gray before:mr-1 before:block before:h-[1px] before:flex-1 before:bg-d-gray/10  after:ml-1 after:block after:h-[1px] after:flex-1 after:bg-d-gray/10">
            {format(new Date(message.createdAt), "MMMM d, yyyy")}
          </div>
        )}
    </>
  );
};

export default MessageItem;

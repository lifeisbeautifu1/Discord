import { Message } from "../types";
import { format, formatRelative } from "date-fns";
import { useAppSelector } from "../app/hooks";
import { sameDay } from "../util";

type Props = {
  message: Message;
  index: number;
};

const MessageItem: React.FC<Props> = ({ message, index }) => {
  const { messages } = useAppSelector((state) => state.conversations);

  return (
    <>
      {index + 1 === messages.length ||
      (index + 1 < messages.length &&
        (messages[index + 1].authorId !== message.authorId ||
          new Date(messages[index].createdAt).getTime() -
            new Date(messages[index + 1].createdAt).getTime() >
            1000 * 60 * 10)) ? (
        <li
          className={`mt-4 flex items-start px-4 py-0.5 transition	ease-out hover:bg-[#2f3136]/50 ${
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
        </li>
      ) : (
        <li className="group flex items-start px-4 py-0.5	transition ease-out hover:bg-[#2f3136]/50">
          <div className="flex h-[22px] w-10 flex-shrink-0 items-center justify-center">
            <span className="hidden text-[10px] text-d-gray group-hover:block">
              {format(new Date(message?.createdAt), "p")}
            </span>
          </div>
          <div className="ml-4">
            <p className="-mt-0.5 text-base text-[#dcddde]">
              {message.content}
            </p>
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

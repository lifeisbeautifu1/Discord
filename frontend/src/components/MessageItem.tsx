import { Message } from "../types";
import { format, formatRelative } from "date-fns";

type Props = {
  message: Message;
};

const MessageItem: React.FC<Props> = ({ message }) => {
  return (
    <>
      <li className="mt-4 flex items-start px-4 py-0.5 transition	ease-out hover:bg-[#2f3136]/50">
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
      {/* <li className="group flex items-start px-4 py-0.5	transition ease-out hover:bg-[#2f3136]/50">
        <div className="flex h-[22px] w-10 flex-shrink-0 items-center justify-center">
          <span className="hidden text-[10px] text-d-gray group-hover:block">
            {format(new Date(message?.createdAt), "p")}
          </span>
        </div>
        <div className="ml-4">
          <p className="-mt-0.5 text-base text-[#dcddde]">{message.content}</p>
        </div>
      </li> */}
    </>
  );
};

export default MessageItem;

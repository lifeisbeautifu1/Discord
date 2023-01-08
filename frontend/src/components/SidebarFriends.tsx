import { FriendIcon } from "./icons";
import { AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Tooltip, UserInfo, Skeleton, ConversationItem } from "./";
import { useAppSelector } from "../app/hooks";

const SidebarFriends = () => {
  const { converastions, selectedConversation } = useAppSelector(
    (state) => state.conversations
  );
  const { incomingFriendRequests } = useAppSelector((state) => state.friends);
  return (
    <aside className="relative flex w-60 flex-shrink-0 select-none flex-col bg-secondary text-d-default">
      <div className="h-12 border-b border-b-d-dark-black p-2.5 shadow">
        <button className="h-[28px] w-full rounded bg-d-dark-black px-1.5 py-[1px] text-left text-sm font-medium ">
          Find or start conversation
        </button>
      </div>
      <div className="p-2 pb-0">
        <Link to="/channels/@me">
          <button className="flex w-full items-center rounded bg-d-icon-bg px-3 py-2 text-left font-medium text-d-white transition hover:bg-d-icon-bg-hover">
            <FriendIcon className="mr-3.5 h-6 w-6" />
            Friends
            {incomingFriendRequests.length > 0 && (
              <span className="pill ml-auto">
                {incomingFriendRequests.length > 9
                  ? "9+"
                  : incomingFriendRequests.length}
              </span>
            )}
          </button>
        </Link>
      </div>
      <UserInfo />
      <div className="flex h-10 pt-5 pr-4 pb-1 pl-[18px] text-xs font-semibold  hover:text-white">
        <span className="flex-1 uppercase">Direct Messages</span>
        <Tooltip text="Create DM">
          <AiOutlinePlus
            strokeWidth="30"
            className="cursor-pointer text-base font-bold"
          />
        </Tooltip>
      </div>
      {converastions.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {converastions.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
            />
          ))}
        </ul>
      ) : (
        <Skeleton />
      )}
    </aside>
  );
};

export default SidebarFriends;

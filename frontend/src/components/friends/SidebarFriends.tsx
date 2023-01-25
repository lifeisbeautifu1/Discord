import { FriendIcon } from "../icons";
import { AiOutlinePlus } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Tooltip,
  UserInfo,
  Skeleton,
  ConversationItem,
  SelectableFriend,
} from "..";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toShowFromFriend } from "../../util";
import { selectUser } from "../../features/auth/auth";
import {
  resetSelectedFriends,
  toggleSelectedFriend,
} from "../../features/friends/friends";
import { createConversation } from "../../features/conversations/conversations.thunks";
import { Friend } from "../../types";

const SidebarFriends = () => {
  const { conversations } = useAppSelector((state) => state.conversations);

  const { incomingFriendRequests, friends, selectedFriends } = useAppSelector(
    (state) => state.friends
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [localFriends, setLocalFriends] = useState<Array<Friend>>([]);

  useEffect(() => {
    setLocalFriends(friends);
  }, [friends]);

  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (searchTerm.trim())
      setLocalFriends((prev) =>
        prev.filter((friend) =>
          toShowFromFriend(user?.id!, friend)
            ?.username.toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
    else setLocalFriends(friends);
  }, [searchTerm]);

  const dispatch = useAppDispatch();

  const listRef = useRef<HTMLUListElement>(null);

  const [isScrolled, setIsScrolled] = useState(false);

  if (!user) return null;

  const handleScroll = (e: React.UIEvent<HTMLUListElement, UIEvent>) => {
    if (listRef?.current?.scrollTop) {
      console.log(listRef.current.scrollTop);
      listRef.current.scrollTop > 2
        ? setIsScrolled(true)
        : setIsScrolled(false);
    }
  };

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

        <Menu as="div" className="relative flex items-center justify-center">
          <Menu.Button>
            <Tooltip text="Create DM">
              <AiOutlinePlus
                strokeWidth="30"
                className="cursor-pointer text-base font-bold"
              />
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
            <Menu.Items className="custom-shadow absolute top-1/2 left-1/2 z-50 m-1 flex max-h-[440px] w-[400px] flex-col rounded border-none bg-dark text-sm text-d-gray outline-none">
              <div
                className={`p-4 ${
                  isScrolled && "border-b border-b-d-black shadow"
                }`}
              >
                <h2 className="text-xl font-semibold text-d-white">
                  Select friends
                </h2>
                <p className="mt-1.5 text-xs font-light">
                  You can add {9 - selectedFriends.length} more friends
                </p>
                <div className="mt-4 flex rounded bg-d-dark-black px-0.5 py-0.5">
                  <ul className="flex items-center space-x-[2px]">
                    {selectedFriends.map((friend) => (
                      <li
                        key={friend.id}
                        onClick={() => dispatch(toggleSelectedFriend(friend))}
                        className="flex cursor-pointer items-center space-x-2 rounded bg-dark p-1 px-3 text-base font-normal text-d-white"
                      >
                        <span>
                          {toShowFromFriend(user.id, friend)?.username}
                        </span>
                        <RxCross2 className="mt-0.5" />
                      </li>
                    ))}
                  </ul>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                    className="my-1 flex-1 border-none bg-transparent pl-2 text-base font-normal outline-none placeholder:text-d-gray"
                    placeholder="Type the username of friend"
                  />
                </div>
              </div>
              <ul
                ref={listRef}
                onScroll={handleScroll}
                className="flex flex-1 flex-col space-y-1 overflow-y-scroll px-2 py-1 pb-4"
              >
                {localFriends.map((friend) => (
                  <SelectableFriend key={friend.id} friend={friend} />
                ))}
              </ul>
              <div
                className="mx-2 border-t-[0.5px] border-gray-600 py-4 px-2
              "
              >
                <Menu.Item>
                  {({ close }) => (
                    <button
                      onClick={() => {
                        dispatch(createConversation());
                        dispatch(resetSelectedFriends());
                        close();
                      }}
                      className="flex h-10 w-full items-center justify-center rounded border-none bg-brand px-6 py-2 text-sm font-medium text-white outline-none transition ease-in hover:bg-d-brand-hover"
                    >
                      {selectedFriends.length <= 1
                        ? "Create DM"
                        : "Create Group DM"}
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      {conversations.length > 0 ? (
        <ul className="mt-2 space-y-1">
          {conversations.map((conversation) => (
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

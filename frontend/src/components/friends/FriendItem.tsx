import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { HiChatBubbleLeft, HiEllipsisVertical } from "react-icons/hi2";
import { ActionIcon } from "../icons";
import { selectUser } from "../../features/auth/auth";
import { Friend } from "../../types";
import { Avatar } from "..";
import {
  setFriendToDelete,
  setRemoveFriendModal,
} from "../../features/friends/friends";

type Props = {
  friend: Friend;
  online?: boolean;
};

const FriendItem: React.FC<Props> = ({ friend, online = false }) => {
  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  const isSender = friend?.sender?.id === user?.id;

  const toShow = isSender ? friend.receiver : friend.sender;

  const handleDelete = () => {
    dispatch(setRemoveFriendModal(true));
    dispatch(setFriendToDelete(friend));
  };

  return (
    <li className="fr relative ml-[30px] mr-5 flex h-[62px] cursor-pointer items-center border-t border-d-icon-bg hover:ml-5 hover:mr-2.5 hover:rounded-lg hover:border-t-transparent hover:bg-d-icon-bg hover:py-4 hover:px-2.5">
      <div className="flex items-center">
        <Avatar
          online={online}
          offline={!online}
          image={`https://cdn.discordapp.com/embed/avatars/${
            parseInt(toShow?.u_name.split("#")[1]!) % 5
          }.png`}
        />
        <div className="ml-3 flex flex-col justify-center">
          <h2 className="font-semibold text-d-white">
            {toShow?.username}
            <span className="hidden text-sm font-medium text-d-gray group-hover:inline">
              #{toShow?.u_name.split("#")?.[1]}
            </span>
          </h2>
          <p className="-mt-1 text-sm font-medium text-d-gray">
            {online ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <div className="ml-auto flex items-center space-x-3">
        <ActionIcon
          tooltip="Message"
          hoverColor="hover:text-d-white"
          icon={<HiChatBubbleLeft />}
        />
        <Menu as="div" className="relative flex items-center justify-center">
          <Menu.Button>
            <ActionIcon
              tooltip="More"
              hoverColor="hover:text-d-white"
              icon={<HiEllipsisVertical />}
            />
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
            <Menu.Items className="absolute top-1/2 left-1/2 z-50 m-1 w-[200px] rounded bg-d-dark-black p-1.5 text-sm font-semibold text-d-gray">
              <Menu.Item>
                <div className="rounded p-2 transition hover:bg-brand hover:text-d-white">
                  Start Video Call
                </div>
              </Menu.Item>
              <Menu.Item>
                <div className="rounded p-2 transition hover:bg-brand hover:text-d-white">
                  Start Voice Call
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  onClick={handleDelete}
                  className="rounded p-2 text-red-500 transition hover:bg-red-500 hover:text-d-white"
                >
                  Remove Friend
                </div>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </li>
  );
};

export default FriendItem;

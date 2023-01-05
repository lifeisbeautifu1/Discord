import { useAppSelector } from "../app/hooks";
import { ActionIcon } from "./icons";
import { RxCross1 } from "react-icons/rx";
import { IoCheckmark } from "react-icons/io5";
import { selectUser } from "../features/auth/auth";
import { FriendRequest } from "../types";
import { Avatar } from "./";

type Props = {
  friendRequest: FriendRequest;
};

const FriendRequestItem: React.FC<Props> = ({ friendRequest }) => {
  const user = useAppSelector(selectUser);

  const isSender = friendRequest.senderId === user?.id;

  const toShow = isSender ? friendRequest.receiver : friendRequest.sender;

  return (
    <li className="fr relative ml-[30px] mr-5 flex h-[62px] cursor-pointer items-center border-t border-d-icon-bg hover:ml-5 hover:mr-2.5 hover:rounded-lg hover:border-t-transparent hover:bg-d-icon-bg hover:py-4 hover:px-2.5">
      <div className="flex items-center">
        <Avatar />
        <div className="ml-3 flex flex-col justify-center">
          <h2 className="font-semibold text-d-white">
            {toShow?.username}
            <span className="hidden text-sm font-medium text-d-gray group-hover:inline">
              #{toShow?.u_name.split("#")?.[1]}
            </span>
          </h2>
          <p className="-mt-0.5 text-xs font-medium text-d-gray">
            {isSender ? "Outgoing friend request" : "Incoming friend request"}
          </p>
        </div>
      </div>
      <div className="ml-auto flex items-center space-x-3">
        {isSender ? (
          <ActionIcon
            onClick={() => {}}
            tooltip="Cancel"
            hoverColor="hover:text-red-500"
            icon={<RxCross1 />}
          />
        ) : (
          <>
            <ActionIcon
              onClick={() => {}}
              hoverColor="hover:text-green-500"
              tooltip="Accept"
              icon={<IoCheckmark />}
            />
            <ActionIcon
              onClick={() => {}}
              hoverColor="hover:text-red-500"
              tooltip="Ignore"
              icon={<RxCross1 />}
            />
          </>
        )}
      </div>
    </li>
  );
};

export default FriendRequestItem;

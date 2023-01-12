import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AiOutlineCheck } from "react-icons/ai";
import { selectUser } from "../../features/auth/auth";
import { toggleSelectedFriend } from "../../features/friends/friends";
import { Friend } from "../../types";
import { isOnline, toShowFromFriend } from "../../util";
import Avatar from "../util/Avatar";

type Props = {
  friend: Friend;
};

const SelectableFriend: React.FC<Props> = ({ friend }) => {
  const user = useAppSelector(selectUser);

  const { onlineFriends, selectedFriends } = useAppSelector(
    (state) => state.friends
  );

  const dispatch = useAppDispatch();

  if (!user) return null;

  const toShow = toShowFromFriend(user?.id, friend);

  const online = isOnline(user?.id!, toShow?.id!, onlineFriends);

  const selected = selectedFriends.find((fr) => fr.id === friend.id);

  return (
    <li
      onClick={() => dispatch(toggleSelectedFriend(friend))}
      className={`flex cursor-pointer items-center rounded bg-transparent px-2 py-1 font-normal transition ease-out hover:bg-d-icon-bg-hover hover:text-d-white`}
    >
      <Avatar
        online={online}
        offline={!online}
        image={`https://cdn.discordapp.com/embed/avatars/${
          parseInt(toShow?.u_name.split("#")[1]!) % 5
        }.png`}
      />
      <h2 className="ml-3 mr-2 text-d-white">{toShow?.username}</h2>
      <p className="truncate font-semibold text-d-gray/80">{toShow?.u_name}</p>
      <div
        className={`ml-auto flex h-6 w-6 items-center justify-center rounded-md border border-d-gray/70 ${
          selected && "border-brand/70"
        }`}
      >
        {selected && <AiOutlineCheck className="text-lg text-brand" />}
      </div>
    </li>
  );
};

export default SelectableFriend;

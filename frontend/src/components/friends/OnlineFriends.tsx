import { IoSearchOutline } from "react-icons//io5";
import { RxCross1 } from "react-icons/rx";
import { useAppSelector } from "../../app/hooks";
import { useEffect, useState } from "react";
import { FriendItem } from "..";
import { Friend } from "../../types";
import { selectUser } from "../../features/auth/auth";

const OnlineFriends = () => {
  const { onlineFriends } = useAppSelector((state) => state.friends);

  const user = useAppSelector(selectUser);

  const [localOnlineFriends, setLocalOnlineFriends] =
    useState<Array<Friend>>(onlineFriends);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLocalOnlineFriends(onlineFriends);
  }, [onlineFriends]);

  useEffect(() => {
    if (searchTerm.trim()) {
      setLocalOnlineFriends(
        onlineFriends.filter((friend) => {
          const isSender = friend.sender?.id === user?.id;
          const toShow = isSender ? friend.receiver : friend.sender;
          return toShow?.username
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        })
      );
    } else {
      setLocalOnlineFriends(onlineFriends);
    }
  }, [searchTerm]);

  return (
    <div className="flex h-full w-full flex-col text-d-gray">
      <div className="relative my-4 ml-[30px] mr-5 flex items-center rounded bg-d-dark-black py-1.5 px-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="w-full border-none bg-transparent outline-none"
        />
        {searchTerm.length === 0 ? (
          <IoSearchOutline className="rotate text-xl text-d-white" />
        ) : (
          <RxCross1
            onClick={() => setSearchTerm("")}
            className="rotate cursor-pointer text-xl text-d-gray hover:text-d-white"
          />
        )}
      </div>
      <div className="ml-[30px] mr-5 mt-2">
        <h2 className="text-xs font-semibold uppercase">
          Online Friends - {localOnlineFriends.length}
        </h2>
      </div>
      {localOnlineFriends.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-[220px] w-[420px]">
              <img
                src="/images/no-friends-online-bg.svg"
                alt="no friends online right now"
              />
            </div>
            <p className="mt-8 text-[#a3a6aa]">
              Wumpus looked, but coudn't find anyone with that name.
            </p>
          </div>
        </div>
      ) : (
        <ul className="mt-4">
          {localOnlineFriends.map((friend) => (
            <FriendItem online={true} key={friend.id} friend={friend} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default OnlineFriends;

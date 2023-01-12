import { IoSearchOutline } from "react-icons//io5";
import { RxCross1 } from "react-icons/rx";
import { useAppSelector } from "../../app/hooks";
import React, { useEffect, useState } from "react";
import { FriendRequestItem } from "..";
import { selectFriendRequests } from "../../features/friends/friends";
import { FriendRequest } from "../../types";
import { selectUser } from "../../features/auth/auth";

const FriendRequests = () => {
  const allFriendRequests = useAppSelector(selectFriendRequests);

  const user = useAppSelector(selectUser);

  const [friendRequests, setFriendRequests] =
    useState<Array<FriendRequest>>(allFriendRequests);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setFriendRequests(allFriendRequests);
  }, [allFriendRequests]);

  useEffect(() => {
    if (searchTerm.trim()) {
      setFriendRequests(
        allFriendRequests.filter((fr) => {
          const isSender = fr.senderId === user?.id;
          const toShow = isSender ? fr.receiver : fr.sender;
          return toShow?.username
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        })
      );
    } else {
      setFriendRequests(allFriendRequests);
    }
  }, [searchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex h-full w-full flex-col text-d-gray">
      <div className="relative my-4 ml-[30px] mr-5 flex items-center rounded bg-d-dark-black py-1.5 px-3">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
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
          Pending – {friendRequests.length}
        </h2>
      </div>
      {friendRequests.length === 0 ? (
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
          {friendRequests.map((fr) => (
            <FriendRequestItem key={fr.id} friendRequest={fr} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendRequests;

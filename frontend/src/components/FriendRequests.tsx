import { IoSearchOutline } from "react-icons//io5";
import { useAppSelector } from "../app/hooks";
import { FriendRequestItem } from "./";
import { selectFriendRequests } from "../features/friendRequests/friendRequest";

const FriendRequests = () => {
  const friendRequests = useAppSelector(selectFriendRequests);
  return (
    <div className="flex h-full w-full flex-col text-d-gray">
      <div className="my-4 ml-[30px] mr-5 flex items-center rounded bg-d-dark-black py-1.5 px-3">
        <input
          type="text"
          placeholder="Search"
          className="w-full border-none bg-transparent outline-none"
        />
        <IoSearchOutline className="text-xl" />
      </div>
      <div className="ml-[30px] mr-5 mt-2">
        <h2 className="text-xs font-semibold uppercase">
          Pending – {friendRequests.length}
        </h2>
      </div>
      <ul className="mt-4">
        {friendRequests.map((fr) => (
          <FriendRequestItem key={fr.id} friendRequest={fr} />
        ))}
      </ul>
    </div>
  );
};

export default FriendRequests;

import { Tooltip } from "../components";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { BiSearch } from "react-icons/bi";
import { BsFillPinAngleFill } from "react-icons/bs";
import { FaUserPlus, FaUserCircle } from "react-icons/fa";
import {
  HiInbox,
  HiPhoneArrowUpRight,
  HiQuestionMarkCircle,
  HiVideoCamera,
} from "react-icons/hi2";
import { useAppSelector } from "../app/hooks";
import { selectUser } from "../features/auth/auth";
import { isOnline, toShowFromConversation } from "../util";

const ConversationHeader = () => {
  const { selectedConversation } = useAppSelector(
    (state) => state.conversations
  );

  const { onlineFriends } = useAppSelector((state) => state.friends);

  const user = useAppSelector(selectUser);

  if (!selectedConversation || !user) return null;

  const toShow = toShowFromConversation(user?.id, selectedConversation);

  const online = isOnline(user?.id!, toShow?.id!, onlineFriends);
  return (
    <header className="flex h-12 w-full flex-shrink-0 items-center justify-between border-b border-d-black px-3.5 pr-6 shadow">
      <div className="flex items-center space-x-4">
        <MdOutlineAlternateEmail className="text-2xl text-d-gray" />
        <h2 className="font-semibold text-d-white">{toShow?.username}</h2>
        {online ? (
          <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-dark bg-green-500"></span>
        ) : (
          <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-d-gray bg-transparent"></span>
        )}
      </div>
      <div className="flex items-center space-x-4 text-d-gray">
        <Tooltip text="Start Voice Call" position="bottom">
          <HiPhoneArrowUpRight className="cursor-pointer text-xl hover:text-d-white" />
        </Tooltip>
        <Tooltip text="Start Video Call" position="bottom">
          <HiVideoCamera className="cursor-pointer text-2xl hover:text-d-white" />
        </Tooltip>
        <Tooltip text="Pinned Messages" position="bottom">
          <BsFillPinAngleFill className="cursor-pointer text-xl hover:text-d-white" />
        </Tooltip>
        <Tooltip text="Add Friends to DM" position="bottom">
          <FaUserPlus className="cursor-pointer text-xl hover:text-d-white" />
        </Tooltip>
        <Tooltip text="Show User Profile" position="bottom">
          <FaUserCircle className="cursor-pointer text-xl hover:text-d-white" />
        </Tooltip>
        <div className="flex w-full max-w-[130px] items-center rounded bg-d-dark-black py-0.5 pl-1.5 pr-2 text-sm text-d-gray transition-all duration-300 ease-out placeholder:text-d-gray focus-within:max-w-[200px]">
          <input
            type="text"
            placeholder="Search"
            className="w-full border-none bg-transparent font-semibold outline-none placeholder:font-semibold"
          />
          <BiSearch className="flex-shrink-0 text-base" />
        </div>
        <Tooltip position="bottom" text="Inbox">
          <HiInbox className="h-[25px] w-[25px] cursor-pointer transition hover:text-d-white" />
        </Tooltip>
        <Tooltip position="bottom" text="Help">
          <HiQuestionMarkCircle className="h-[25px] w-[25px] cursor-pointer text-green-600" />
        </Tooltip>
      </div>
    </header>
  );
};

export default ConversationHeader;

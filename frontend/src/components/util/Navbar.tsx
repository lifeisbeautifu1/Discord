import { FaDiscord, FaCompass } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { ServerIcon, NotificationIcon } from "../icons";
import { TbDownload } from "react-icons/tb";
import { useAppSelector } from "../../app/hooks";

const Navbar: React.FC = () => {
  const { incomingFriendRequests } = useAppSelector((state) => state.friends);
  const { notifications } = useAppSelector((state) => state.conversations);
  return (
    <nav className="flex h-full w-[72px] flex-shrink-0 select-none flex-col items-center space-y-2 bg-d-dark-black py-3">
      <ServerIcon
        to="/channels/@me"
        notifications={incomingFriendRequests.length}
        main
        icon={<FaDiscord />}
        tooltip="Direct Messages"
      />
      {notifications.map((notification) => (
        <NotificationIcon key={notification.id} notification={notification} />
      ))}
      <div className="h-[1.5px] w-[40%] bg-gray-700" />
      <ServerIcon
        to="/"
        hover="hover:bg-green-500"
        textColor="text-green-500"
        tooltip="Add a Server"
        icon={<AiOutlinePlus />}
      />
      <ServerIcon
        to="/"
        hover="hover:bg-green-500"
        textColor="text-green-500"
        tooltip="Explore Public Servers"
        icon={<FaCompass />}
      />
      <div className="h-[1.5px] w-[40%] bg-gray-700" />
      <ServerIcon
        to="/"
        hover="hover:bg-green-500"
        textColor="text-green-500"
        size="text-[24px]"
        classNames="pb-1"
        tooltip="Download Apps"
        icon={<TbDownload />}
      />
    </nav>
  );
};

export default Navbar;

import { Avatar } from "..";
import { Icon } from "../icons";
import { FaMicrophone } from "react-icons/fa";
import { MdHeadphones } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/auth/auth";

const UserInfo = () => {
  const user = useAppSelector(selectUser);

  return (
    <div className="opacity-1 absolute bottom-0 left-0 right-0 z-20 bg-secondary-alt p-2 shadow">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 cursor-pointer items-center gap-2 rounded p-1 py-1 hover:bg-d-icon-bg">
          <Avatar
            image={`https://cdn.discordapp.com/embed/avatars/${
              parseInt(user?.u_name.split("#")[1]!) % 5
            }.png`}
          />
          <div className="flex flex-col justify-center text-sm">
            <h2 className="font-semibold text-white">
              {user?.u_name.split("#")?.[0]}
            </h2>
            <p className="mt-[-2px] text-xs leading-[14px]">
              #{user?.u_name.split("#")?.[1]}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <Icon tooltip="Mute" size={"text-[17px]"} icon={<FaMicrophone />} />
          <Icon tooltip="Deafen" size="text-xl" icon={<MdHeadphones />} />
          <Icon tooltip="User Settings" icon={<IoSettingsSharp />} />
        </div>
      </div>
    </div>
  );
};

export default UserInfo;

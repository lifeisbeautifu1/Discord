import { BsFillCameraVideoFill } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { HiPhoneMissedCall } from "react-icons/hi";
import Tooltip from "../../util/Tooltip";
import { ShareScreenIcon } from "../../icons";

const CallActions = () => {
  return (
    <div className="mt-6 flex items-center space-x-4">
      <Tooltip text="Turn On Camera">
        <div className="action-icon">
          <BsFillCameraVideoFill />
        </div>
      </Tooltip>
      <Tooltip text="Share Your Screen">
        <div className="action-icon">
          <ShareScreenIcon />
        </div>
      </Tooltip>
      <Tooltip text="Mute">
        <div className="action-icon">
          <FaMicrophone />
        </div>
      </Tooltip>
      <Tooltip text="Disconnect">
        <div className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-red-500 text-2xl text-d-white">
          <HiPhoneMissedCall />
        </div>
      </Tooltip>
    </div>
  );
};

export default CallActions;

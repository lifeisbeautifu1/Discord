import { FaDiscord } from "react-icons/fa";

const Avatar = () => {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-white">
      <FaDiscord className="text-[22px]" />
    </div>
  );
};

export default Avatar;

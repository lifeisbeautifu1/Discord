import { FaDiscord } from "react-icons/fa";

type Props = {
  offline?: boolean;
};

const Avatar: React.FC<Props> = ({ offline = true }) => {
  return (
    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-white">
      <FaDiscord className="text-[22px]" />
      {offline && (
        <span className="absolute -bottom-1 -right-1 box-content flex h-2.5 w-2.5 items-center justify-center rounded-full border-[3px] border-dark">
          <span className="absolute bottom-0 right-0 box-content h-1.5 w-1.5 rounded-full border-2 border-gray-400 bg-dark" />
        </span>
      )}
    </div>
  );
};

export default Avatar;

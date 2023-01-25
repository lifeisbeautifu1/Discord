import { PulseLoader } from "react-spinners";

type Props = {
  name?: string;
};

const TypingIndicator: React.FC<Props> = ({ name = "User" }) => {
  return (
    <div className="flex items-center space-x-2 text-sm text-d-gray">
      <PulseLoader speedMultiplier={0.3} color="white" size={8} />
      <p>
        <strong className="text-d-white">{name}</strong> is typing...
      </p>
    </div>
  );
};

export default TypingIndicator;

import { CallActions } from ".";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../features/auth/auth";

const ConversationCall = () => {
  const user = useAppSelector(selectUser);

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex items-center space-x-3">
        <img
          src={`https://cdn.discordapp.com/embed/avatars/${
            parseInt(user?.u_name.split("#")[1]!) % 5
          }.png`}
          className="h-20 w-20 rounded-full"
        />
        <img
          src={`https://cdn.discordapp.com/embed/avatars/${
            (parseInt(user?.u_name.split("#")[1]!) + 1) % 5
          }.png`}
          className="h-20 w-20 rounded-full"
        />
      </div>
      <CallActions />
    </div>
  );
};

export default ConversationCall;

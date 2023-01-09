import { PulseLoader } from "react-spinners";
import { useAppSelector } from "../app/hooks";
import { selectUser } from "../features/auth/auth";
import { toShowFromConversation } from "../util";

const TypingIndicator = () => {
  const { selectedConversation, isTyping } = useAppSelector(
    (state) => state.conversations
  );
  const user = useAppSelector(selectUser);

  if (!selectedConversation || !user) return null;

  const toShow = toShowFromConversation(user.id, selectedConversation);

  if (!isTyping) return null;

  return (
    <div className="mx-4 mt-1 mb-3 flex items-center space-x-2 text-sm text-d-gray">
      <PulseLoader speedMultiplier={0.6} color="white" size={8} />
      <p>
        <strong className="text-d-white">{toShow?.username}</strong> is
        typing...
      </p>
    </div>
  );
};

export default TypingIndicator;

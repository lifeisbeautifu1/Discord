import { Avatar } from ".";
import { useAppSelector } from "../app/hooks";
import { selectUser } from "../features/auth/auth";
import { useNavigate } from "react-router-dom";
import { Conversation } from "../types";
import { isOnline, toShowFromConversation, toShowFromFriend } from "../util";

type Props = {
  conversation: Conversation;
};

const ConversationItem: React.FC<Props> = ({ conversation }) => {
  const user = useAppSelector(selectUser);

  const { onlineFriends } = useAppSelector((state) => state.friends);

  const navigate = useNavigate();

  const toShow = toShowFromConversation(user?.id!, conversation);

  const { selectedConversation } = useAppSelector(
    (state) => state.conversations
  );

  const online = isOnline(user?.id!, toShow?.id!, onlineFriends);

  return (
    <li
      onClick={() => navigate("/channels/@me/" + conversation.id)}
      className={`mx-2 flex cursor-pointer items-center space-x-3 rounded bg-transparent px-2 py-1 font-medium transition ease-out hover:bg-d-icon-bg-hover hover:text-d-white ${
        selectedConversation?.id === conversation.id &&
        "bg-d-icon-bg text-d-white"
      }`}
    >
      <Avatar online={online} offline={!online} />
      <h2>{toShow?.username}</h2>
    </li>
  );
};

export default ConversationItem;

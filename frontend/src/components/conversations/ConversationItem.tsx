import { Avatar } from "..";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/auth/auth";
import { useNavigate } from "react-router-dom";
import { Conversation } from "../../types";
import { isOnline, toShowFromConversation } from "../../util";

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

  const group = conversation?.participants.length > 2;

  const groupName = conversation?.participants
    .filter((p) => p.userId !== user?.id)
    .map((p) => p.user?.username)
    .join(", ");

  return (
    <li
      onClick={() => navigate("/channels/@me/" + conversation.id)}
      className={`mx-2 flex cursor-pointer items-center space-x-3 rounded bg-transparent px-2 py-1 font-medium transition ease-out hover:bg-d-icon-bg-hover hover:text-d-white ${
        selectedConversation?.id === conversation.id &&
        "bg-d-icon-bg text-d-white"
      }`}
    >
      <Avatar
        online={group ? false : online}
        offline={group ? false : !online}
        image={
          group
            ? "/images/group-avatar.png"
            : `https://cdn.discordapp.com/embed/avatars/${
                parseInt(toShow?.u_name.split("#")[1]!) % 5
              }.png`
        }
      />
      <div className="flex flex-col justify-center">
        <h2>{group ? groupName : toShow?.username}</h2>
        {group && (
          <h3 className="-mt-1 text-xs">
            {conversation.participants.length} members
          </h3>
        )}
      </div>
    </li>
  );
};

export default ConversationItem;

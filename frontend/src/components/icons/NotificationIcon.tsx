import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { Notification } from "../../types";
import { toShowFromConversation } from "../../util";

type Props = {
  notification: Notification & {
    amount: number;
  };
};

const NotificationIcon: React.FC<Props> = ({ notification }) => {
  const { user } = useAppSelector((state) => state.auth);

  const { conversations } = useAppSelector((state) => state.conversations);

  const conversation = conversations.find(
    (conversation) => conversation.id === notification.conversationId
  );

  if (!user || !conversation) return null;

  const toShow = toShowFromConversation(user?.id!, conversation!);

  const group = conversation?.participants.length > 2;

  const image = group
    ? "/images/group-avatar.png"
    : `https://cdn.discordapp.com/embed/avatars/${
        parseInt(toShow?.u_name.split("#")[1]!) % 5
      }.png`;

  const groupName = conversation.participants
    .filter((p) => p.userId !== user?.id)
    .map((p) => p.user?.username)
    .join(", ");

  return (
    <NavLink
      to={"/channels/@me/" + notification.conversationId}
      className="duration group relative flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center rounded-3xl bg-dark transition-all duration-200 ease-out hover:rounded-2xl hover:after:absolute hover:after:top-1/2 hover:after:-left-3.5 hover:after:h-5 hover:after:w-1.5 hover:after:-translate-y-1/2 hover:after:rounded-br hover:after:rounded-tr hover:after:bg-white hover:after:transition-all hover:after:duration-200 hover:after:ease-out"
    >
      <img
        src={image}
        className="h-full w-full rounded-3xl object-cover transition-all duration-200 ease-out group-hover:rounded-2xl"
        alt="avatar"
      />
      <span className="absolute left-16 z-[20] m-2 min-w-max origin-left scale-0 rounded-md bg-[#111] px-3 py-2 text-sm font-bold text-white shadow-md transition-all duration-100 before:absolute before:top-1/2 before:-left-2.5 before:w-0 before:translate-y-[-50%] before:border-[5px] before:border-solid before:border-t-transparent before:border-l-transparent before:border-b-transparent before:border-r-[#111] before:bg-transparent group-hover:scale-100">
        {group ? groupName : toShow?.username}
      </span>
      <span className="pill absolute -bottom-1 -right-1 z-20 box-content border-4 border-d-dark-black p-[1px]">
        {notification.amount}
      </span>
    </NavLink>
  );
};

export default NotificationIcon;

import { EmailVerifyPopup, SidebarFriends } from "../components";

const Conversation = () => {
  return (
    <div className="flex w-full select-none flex-col overflow-hidden">
      <EmailVerifyPopup />
      <div className="flex h-full w-full">
        <SidebarFriends />
        <div className="h-full w-full bg-dark"></div>
      </div>
    </div>
  );
};

export default Conversation;

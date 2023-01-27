import { Outlet } from "react-router-dom";
import { Navbar } from "..";
import {
  EmailModal,
  FriendRequestModal,
  RemoveFriendModal,
  DeleteMessageModal,
  IncomingCallModal,
  CallModal,
} from "../Modals";

const Layout: React.FC = () => {
  return (
    <div className="fixed flex h-screen w-screen overflow-hidden">
      <Navbar />
      <Outlet />
      <EmailModal />
      <FriendRequestModal />
      <RemoveFriendModal />
      <DeleteMessageModal />
      <IncomingCallModal />
      <CallModal />
    </div>
  );
};

export default Layout;

import { Outlet } from "react-router-dom";
import { Navbar } from "./";
import { EmailModal } from "./Modals";

const Layout: React.FC = () => {
  return (
    <div className="relative flex h-screen w-screen overflow-hidden">
      <Navbar />
      <Outlet />
      <EmailModal />
    </div>
  );
};

export default Layout;

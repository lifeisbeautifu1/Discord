import { createContext, useContext } from "react";
import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  withCredentials: true,
});

export const SocketContext = createContext(socket);

type Props = {
  children?: React.ReactNode;
};

export const SocketContextProvider: React.FC<Props> = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);

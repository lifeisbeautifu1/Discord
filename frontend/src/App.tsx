import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { getMe } from "./features/auth/auth.thunks";
import { Layout, Protected } from "./components";
import {
  Landing,
  Login,
  Register,
  Home,
  Conversation as ConversationPage,
  VerifyEmail,
  ResetPassword,
} from "./pages";
import { selectIsAuth } from "./features/auth/auth";
import {
  getFriendRequests,
  getFriends,
} from "./features/friends/friends.thunks";
import { useSocketContext } from "./contexts/SocketContext";
import { Conversation, Friend, FriendRequest } from "./types";
import { OnFriendRequestAcceptedData } from "./types/onFriendRequestAcceptedData";
import {
  addFriend,
  addIncomingFriendRequest,
  removeFriend,
  removeIncomingFriendRequest,
  removeOutgoingFriendRequest,
  setOfflineFriends,
  setOnlineFriends,
} from "./features/friends/friends";
import { getConversations } from "./features/conversations/conversations.thunks";
import { addConversation } from "./features/conversations/conversations";

function App() {
  const isAuth = useAppSelector(selectIsAuth);

  const dispatch = useAppDispatch();

  const socket = useSocketContext();

  useEffect(() => {
    dispatch(getMe());
  }, []);

  useEffect(() => {
    if (isAuth) {
      dispatch(getFriendRequests());
      dispatch(getFriends());
      dispatch(getConversations());
    }
  }, [isAuth]);

  useEffect(() => {
    socket?.emit("getOnlineFriends");

    const interval = setInterval(() => socket?.emit("getOnlineFriends"), 10000);

    socket?.on("onFriendRequestReceived", (data: FriendRequest) => {
      console.log("someone sent me friend request");
      dispatch(addIncomingFriendRequest(data));
    });

    socket?.on("onConversation", (data: Conversation) => {
      console.log("just got new conversation");
      dispatch(addConversation(data));
    });

    socket?.on(
      "onFriendRequestAccepted",
      ({ newFriend, friendRequest }: OnFriendRequestAcceptedData) => {
        console.log("someone accepted my friend request");
        dispatch(removeOutgoingFriendRequest(friendRequest));
        dispatch(addFriend(newFriend));
        socket?.emit("getOnlineFriends");
      }
    );

    socket?.on("onFriendRequestRejected", (data: FriendRequest) => {
      console.log("someone declined my friend request");
      dispatch(removeOutgoingFriendRequest(data));
    });

    socket?.on("onFriendRequestCancelled", (data: FriendRequest) => {
      console.log("someone cancelled friend request to me");
      dispatch(removeIncomingFriendRequest(data));
    });

    socket?.on("onFriendRemoved", (data: Friend) => {
      console.log("someone deleted me from friends");
      dispatch(removeFriend(data));
      socket?.emit("getOnlineFriends");
    });

    socket?.on("getOnlineFriends", (data: Array<Friend>) => {
      console.log("Received online friends: ", data);
      dispatch(setOnlineFriends(data));
      dispatch(setOfflineFriends());
    });

    return () => {
      socket.off("onFriendRequestCancelled");
      socket.off("onFriendRequestRejected");
      socket.off("onFriendRequestAccepted");
      socket.off("onFriendRequestReceived");
      socket.off("onFriendRemoved");
      socket.off("onConversation");

      clearInterval(interval);
    };
  }, [socket]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<VerifyEmail />} />
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="/channels" element={<Layout />}>
        <Route
          path="/channels/@me"
          element={
            <Protected>
              <Home />
            </Protected>
          }
        />
        <Route
          path="/channels/@me/:id"
          element={
            <Protected>
              <ConversationPage />
            </Protected>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;

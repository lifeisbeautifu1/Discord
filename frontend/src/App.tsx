import { Routes, Route } from "react-router-dom";
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
import {
  useSubscribeToConversations,
  useSubscribeToFriendRequests,
  useSubscribeToFriends,
  useGetInitialData,
  useVideoCall,
  useVoiceCall,
  useVideoCallAccepted,
  useVideoCallRejected,
  useVideoCallHangUp,
  useSetPeer,
  useSetCall,
  useSubscribeToNotifications,
} from "./hooks";

function App() {
  useGetInitialData();
  useSubscribeToFriendRequests();
  useSubscribeToFriends();
  useSubscribeToConversations();
  useSubscribeToNotifications();
  useSetPeer();
  useSetCall();
  useVideoCall();
  useVoiceCall();
  useVideoCallAccepted();
  useVideoCallRejected();
  useVideoCallHangUp();

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

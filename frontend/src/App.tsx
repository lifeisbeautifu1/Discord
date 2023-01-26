import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Layout, Protected } from "./components";
// import {
//   Landing,
//   Login,
//   Register,
//   Home,
//   Conversation as ConversationPage,
//   VerifyEmail,
//   ResetPassword,
// } from "./pages";
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const ConversationPage = lazy(() => import("./pages/Conversation"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
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
    <Suspense fallback={<div>Loading...</div>}>
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
    </Suspense>
  );
}

export default App;

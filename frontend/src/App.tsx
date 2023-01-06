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
  Channel,
  VerifyEmail,
  ResetPassword,
} from "./pages";
import { selectIsAuth } from "./features/auth/auth";
import {
  getFriendRequests,
  getFriends,
} from "./features/friends/friends.thunks";

function App() {
  const isAuth = useAppSelector(selectIsAuth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, []);

  useEffect(() => {
    if (isAuth) {
      dispatch(getFriendRequests());
      dispatch(getFriends());
    }
  }, [isAuth]);

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
          path="/channels/:id"
          element={
            <Protected>
              <Channel />
            </Protected>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;

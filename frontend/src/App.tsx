import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAppDispatch } from "./app/hooks";
import { getMe } from "./features/auth/auth.thunks";
import { Protected } from "./components";
import {
  Landing,
  Login,
  Register,
  Home,
  Channel,
  VerifyEmail,
  ResetPassword,
} from "./pages";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<VerifyEmail />} />
      <Route path="/reset" element={<ResetPassword />} />
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
    </Routes>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import { Landing, Login, Register, Home, Channel } from "./pages";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/channels/@me" element={<Home />} />
      <Route path="/channels/:id" element={<Channel />} />
    </Routes>
  );
}

export default App;

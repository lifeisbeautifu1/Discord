import axios from "axios";
import { LoginData, RegisterData } from "../../types";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

const login = async (loginData: LoginData) => {
  const { data } = await axios.post("/auth/login", loginData);
  return data;
};

const register = async (registerData: RegisterData) => {
  const { data } = await axios.post("/auth/register", registerData);
  return data;
};

const getMe = async () => {
  const { data } = await axios.get("/auth/me");
  return data;
};

const logout = async () => {
  await axios.get("/auth/logout");
  return;
};

const verifyEmail = async (token: string) => {
  await axios.post("/auth/email/verify", {
    token,
  });
};

export default {
  login,
  register,
  getMe,
  logout,
  verifyEmail,
};

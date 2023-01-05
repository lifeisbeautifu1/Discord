import axios from "axios";
import { LoginData, RegisterData, User } from "../../types";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

const login = async (loginData: LoginData) => {
  const { data } = await axios.post<User>("/auth/login", loginData);
  return data;
};

const register = async (registerData: RegisterData) => {
  const { data } = await axios.post<User>("/auth/register", registerData);
  return data;
};

const getMe = async () => {
  const { data } = await axios.get<User>("/auth/me");
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

const resendEmailverification = async () => {
  await axios.post("/auth/email/resend");
};

const passwordEmail = async (email: string) => {
  await axios.post("auth/password/email", {
    email,
  });
};

const passwordReset = async (password: string, token: string) => {
  const { data } = await axios.post<User>("auth/password/reset", {
    password,
    token,
  });
  return data;
};

export default {
  login,
  register,
  getMe,
  logout,
  verifyEmail,
  passwordEmail,
  passwordReset,
  resendEmailverification,
};

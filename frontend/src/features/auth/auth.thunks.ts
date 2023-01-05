import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginData, RegisterData } from "../../types";
import authService from "./auth.service";

export const login = createAsyncThunk(
  "auth/login",
  async (loginData: LoginData, thunkAPI) => {
    try {
      const data = await authService.login(loginData);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.errors);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (registerData: RegisterData, thunkAPI) => {
    try {
      const data = await authService.register(registerData);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.errors);
    }
  }
);

export const getMe = createAsyncThunk("auth/getMe", async (_, thunkAPI) => {
  try {
    const data = await authService.getMe();
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error?.response?.data?.errors);
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await authService.logout();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message);
  }
});

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token: string, thunkAPI) => {
    try {
      await authService.verifyEmail(token);
    } catch (error: any) {
      console.log(error);
      return thunkAPI.rejectWithValue(error?.response?.data?.errors);
    }
  }
);

export const passwordEmail = createAsyncThunk(
  "auth/passwordEmail",
  async (email: string, thunkAPI) => {
    try {
      await authService.passwordEmail(email);
      return email;
    } catch (error: any) {
      console.log(error);
      return thunkAPI.rejectWithValue(error?.response?.data?.errors);
    }
  }
);

export const passwordReset = createAsyncThunk(
  "auth/passwordReset",
  async (
    { password, token }: { password: string; token: string },
    thunkAPI
  ) => {
    try {
      const data = await authService.passwordReset(password, token);
      return data;
    } catch (error: any) {
      console.log(error);
      return thunkAPI.rejectWithValue(error?.response?.data?.errors);
    }
  }
);

export const resendEmailVerification = createAsyncThunk(
  "auth/resendEmail",
  async (_, thunkAPI) => {
    try {
      await authService.resendEmailverification();
      return;
    } catch (error: any) {
      console.log(error);
      return thunkAPI.rejectWithValue(error?.response?.data?.errors);
    }
  }
);

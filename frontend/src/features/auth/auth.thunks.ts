import { createAsyncThunk } from "@reduxjs/toolkit";
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

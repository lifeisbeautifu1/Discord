import { createAsyncThunk } from "@reduxjs/toolkit";
import friendRequestsService from "./friendRequests.service";

export const sendFriendRequest = createAsyncThunk(
  "friendRequests/send",
  async (u_name: string, thunkAPI) => {
    try {
      const data = await friendRequestsService.sendFriendRequest(u_name);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getFriendRequests = createAsyncThunk(
  "friendRequests/getFriendRequests",
  async (_, thunkAPI) => {
    try {
      const data = await friendRequestsService.getFriendRequests();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

import { createAsyncThunk } from "@reduxjs/toolkit";
import friendsService from "./friends.service";

export const sendFriendRequest = createAsyncThunk(
  "friends/send",
  async (u_name: string, thunkAPI) => {
    try {
      const data = await friendsService.sendFriendRequest(u_name);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getFriendRequests = createAsyncThunk(
  "friends/getfriends",
  async (_, thunkAPI) => {
    try {
      const data = await friendsService.getFriendRequests();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const cancelFriendRequest = createAsyncThunk(
  "friends/cancel",
  async (id: string, thunkAPI) => {
    try {
      const data = await friendsService.cancelFriendRequest(id);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const rejectFriendRequest = createAsyncThunk(
  "friends/reject",
  async (id: string, thunkAPI) => {
    try {
      const data = await friendsService.rejectFriendRequest(id);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  "friends/accept",
  async (id: string, thunkAPI) => {
    try {
      const data = await friendsService.acceptFriendRequest(id);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getFriends = createAsyncThunk(
  "friends/getFriends",
  async (_, thunkAPI) => {
    try {
      const data = await friendsService.getFriends();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const deleteFriend = createAsyncThunk(
  "friends/deleteFriends",
  async (id: string, thunkAPI) => {
    try {
      const data = await friendsService.deleteFriend(id);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

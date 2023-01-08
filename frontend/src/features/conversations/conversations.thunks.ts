import { createAsyncThunk } from "@reduxjs/toolkit";
import conversationsService from "./conversations.service";

export const getConversations = createAsyncThunk(
  "conversations/getConversations",
  async (_, thunkAPI) => {
    try {
      const data = await conversationsService.getConversations();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getConversation = createAsyncThunk(
  "conversations/getConversation",
  async (id: string, thunkAPI) => {
    try {
      const data = await conversationsService.getConversation(id);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getMessages = createAsyncThunk(
  "conversations/getMessages",
  async (id: string, thunkAPI) => {
    try {
      const data = await conversationsService.getMessages(id);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "conversations/sendMessage",
  async ({ id, content }: { id: string; content: string }, thunkAPI) => {
    try {
      await conversationsService.sendMessage(id, content);
      return;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

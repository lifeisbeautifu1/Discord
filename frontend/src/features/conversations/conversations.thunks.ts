import { createAsyncThunk } from "@reduxjs/toolkit";
import { EditMessageParams } from "../../types/editMessageParams";
import { toShowFromFriend } from "../../util";
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

export const getNotifications = createAsyncThunk(
  "conversations/getNotifications",
  async (_, thunkAPI) => {
    try {
      const data = await conversationsService.getNotifications();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const clearNotifications = createAsyncThunk(
  "conversations/clearNotifications",
  async (conversationId: string, thunkAPI) => {
    try {
      await conversationsService.clearNotifications(conversationId);
      return;
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

export const createConversation = createAsyncThunk(
  "conversations/createConversation",
  async (_, thunkAPI) => {
    try {
      // @ts-ignore
      const user = thunkAPI.getState().auth.user;
      // @ts-ignore
      const participantsIds = thunkAPI
        .getState()
        // @ts-ignore
        .friends.selectedFriends.map((friend) => {
          const toShow = toShowFromFriend(user?.id, friend);
          return toShow?.id;
        });

      await conversationsService.createConversation([
        ...participantsIds,
        user.id,
      ]);
      return;
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

export const getMessagesAfterMessage = createAsyncThunk(
  "conversations/getMessagesAfterMessage",
  async (
    {
      conversationId,
      messageId,
    }: {
      conversationId: string;
      messageId: string;
    },
    thunkAPI
  ) => {
    try {
      const data = await conversationsService.getMessagesAfterMessage(
        conversationId,
        messageId
      );
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

export const editMessage = createAsyncThunk(
  "conversations/editMessage",
  async (params: EditMessageParams, thunkAPI) => {
    try {
      await conversationsService.editMessage(params);
      return;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "conversations/deleteMessage",
  async (
    {
      conversationId,
      messageId,
    }: { conversationId: string; messageId: string },
    thunkAPI
  ) => {
    try {
      await conversationsService.deleteMessage(conversationId, messageId);
      return;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Conversation, Message } from "../../types";
import {
  getConversations,
  getConversation,
  getMessages,
  sendMessage,
} from "./conversations.thunks";

export type ConversationsState = {
  converastions: Array<Conversation>;
  selectedConversation: Conversation | null;
  error: boolean;
  loading: boolean;
  messages: Array<Message>;
};

const initialState: ConversationsState = {
  converastions: [],
  selectedConversation: null,
  error: false,
  loading: false,
  messages: [],
};

export const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<boolean>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getConversations.fulfilled,
        (state, action: PayloadAction<Array<Conversation>>) => {
          state.loading = false;
          state.converastions = action.payload;
        }
      )
      .addCase(getConversations.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getConversation.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getConversation.fulfilled,
        (state, action: PayloadAction<Conversation>) => {
          state.loading = false;
          state.selectedConversation = action.payload;
          state.error = false;
        }
      )
      .addCase(getConversation.rejected, (state) => {
        state.error = true;
        state.loading = false;
      })
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getMessages.fulfilled,
        (state, action: PayloadAction<Array<Message>>) => {
          state.loading = false;
          state.messages = action.payload;
          state.error = false;
        }
      )
      .addCase(getMessages.rejected, (state) => {
        state.error = true;
        state.loading = false;
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.loading = false;
        state.error = false;
      })
      .addCase(sendMessage.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setError } = conversationsSlice.actions;

export default conversationsSlice.reducer;

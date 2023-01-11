import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Conversation, Message } from "../../types";
import {
  getConversations,
  getConversation,
  createConversation,
  getMessages,
  sendMessage,
  deleteMessage,
  editMessage,
} from "./conversations.thunks";

export type ConversationsState = {
  converastions: Array<Conversation>;
  selectedConversation: Conversation | null;
  error: boolean;
  loading: boolean;
  isDeleteMessageModalOpen: boolean;
  selectedMessage: Message | null;
  isEdit: boolean;
  messages: Array<Message>;
  isTyping: boolean;
  typing: boolean;
};

const initialState: ConversationsState = {
  converastions: [],
  selectedConversation: null,
  error: false,
  loading: false,
  isDeleteMessageModalOpen: false,
  selectedMessage: null,
  isEdit: false,
  messages: [],
  isTyping: false,
  typing: false,
};

export const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<boolean>) => {
      state.error = action.payload;
    },
    resetSelectedConversation: (state) => {
      state.selectedConversation = null;
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
      state.converastions.push(action.payload);
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.unshift(action.payload);
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      state.messages = state.messages.map((message) =>
        message.id === action.payload.id
          ? {
              ...message,
              content: action.payload.content,
              updatedAt: action.payload.updatedAt,
            }
          : message
      );
    },
    removeMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(
        (message) => message.id !== action.payload
      );
    },
    setIsDeleteMessageModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isDeleteMessageModalOpen = action.payload;
    },
    setSelectedMessage: (state, action: PayloadAction<Message | null>) => {
      state.selectedMessage = action.payload;
    },
    setIsEdit: (state, action: PayloadAction<boolean>) => {
      state.isEdit = action.payload;
    },
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.typing = action.payload;
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
      })
      .addCase(editMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(editMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
      })
      .addCase(editMessage.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
      })
      .addCase(deleteMessage.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createConversation.pending, (state) => {
        state.loading = true;
      })
      .addCase(createConversation.fulfilled, (state) => {
        state.loading = false;
        state.error = false;
      })
      .addCase(createConversation.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setError,
  addConversation,
  addMessage,
  resetSelectedConversation,
  updateMessage,
  removeMessage,
  setIsDeleteMessageModalOpen,
  setSelectedMessage,
  setIsEdit,
  setIsTyping,
  setTyping,
} = conversationsSlice.actions;

export default conversationsSlice.reducer;

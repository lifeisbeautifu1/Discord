import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Conversation, Message } from "../../types";
import { GetMessagesPayload } from "../../types/getMessagesPayload";
import { TypingPayload } from "../../types/TypingPayload";
import {
  getConversations,
  getConversation,
  createConversation,
  getMessages,
  getMessagesAfterMessage,
  sendMessage,
  deleteMessage,
  editMessage,
} from "./conversations.thunks";

export type ConversationsState = {
  converastions: Array<Conversation>;
  selectedConversation: Conversation | null;
  error: boolean;
  loading: boolean;
  loadingMessages: boolean;
  isDeleteMessageModalOpen: boolean;
  selectedMessage: Message | null;
  lastMessage: Message | null | undefined;
  isEdit: boolean;
  messages: Array<Message>;
  more: boolean;
};

const initialState: ConversationsState = {
  converastions: [],
  selectedConversation: null,
  error: false,
  loading: false,
  loadingMessages: false,
  isDeleteMessageModalOpen: false,
  selectedMessage: null,
  lastMessage: null,
  isEdit: false,
  messages: [],
  more: true,
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
    setUserTyping: (
      state,
      action: PayloadAction<
        TypingPayload & {
          isTyping: boolean;
        }
      >
    ) => {
      if (state.selectedConversation)
        state.selectedConversation = {
          ...state.selectedConversation,
          participants: state.selectedConversation.participants.map(
            (participant) => {
              return participant?.userId === action.payload.userId
                ? {
                    ...participant,
                    isTyping: action.payload.isTyping,
                  }
                : participant;
            }
          ),
        };
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
        state.loadingMessages = true;
      })
      .addCase(
        getMessages.fulfilled,
        (state, action: PayloadAction<GetMessagesPayload>) => {
          state.loadingMessages = false;
          state.messages = action.payload.messages;
          state.lastMessage = action.payload.messages.at(-1);
          state.more = action.payload.more;
          state.error = false;
        }
      )
      .addCase(getMessages.rejected, (state) => {
        state.error = true;
        state.loadingMessages = false;
      })
      .addCase(getMessagesAfterMessage.pending, (state) => {
        state.loadingMessages = true;
      })
      .addCase(
        getMessagesAfterMessage.fulfilled,
        (state, action: PayloadAction<GetMessagesPayload>) => {
          state.loadingMessages = false;
          state.messages = [...state.messages, ...action.payload.messages];
          state.lastMessage = action.payload.messages.at(-1);
          state.more = action.payload.more;
          state.error = false;
        }
      )
      .addCase(getMessagesAfterMessage.rejected, (state) => {
        state.error = true;
        state.loadingMessages = false;
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
  setUserTyping,
} = conversationsSlice.actions;

export default conversationsSlice.reducer;

import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth";
import friendsReducer from "../features/friends/friends";
import conversationsReducer from "../features/conversations/conversations";
import callReducer from "../features/call/callSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    friends: friendsReducer,
    conversations: conversationsReducer,
    call: callReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "callSlice/setPeer",
          "callSlice/setConnection",
          "callSlice/setRemoteStream",
          "callSlice/setLocalStream",
          "callSlice/setCall",
        ],
        // Ignore these field paths in all actions
        // ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: [
          "call.peer",
          "call.connection",
          "call.remoteStream",
          "call.localStream",
          "call.call",
        ],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

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
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

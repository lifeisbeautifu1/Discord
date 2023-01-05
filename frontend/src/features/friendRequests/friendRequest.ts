import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { FriendRequest } from "../../types";
import { sendFriendRequest, getFriendRequests } from "./friendRequests.thunks";

export type FriendRequestsState = {
  error: boolean;
  loading: boolean;
  success: boolean;
  friendRequests: Array<FriendRequest>;
  isModalOpen: boolean;
  u_name: string;
};

const initialState: FriendRequestsState = {
  error: false,
  loading: false,
  success: false,
  friendRequests: [],
  isModalOpen: false,
  u_name: "",
};

export const friendRequestsSlice = createSlice({
  name: "friendRequests",
  initialState,
  reducers: {
    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
    reset: (state) => {
      state.error = false;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendFriendRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        sendFriendRequest.fulfilled,
        (state, action: PayloadAction<FriendRequest>) => {
          state.friendRequests.unshift(action.payload);
          state.loading = false;
          state.success = true;
          state.u_name = action.payload.receiver?.u_name || "";
        }
      )
      .addCase(sendFriendRequest.rejected, (state) => {
        state.error = true;
        state.isModalOpen = true;
        state.loading = false;
      })
      .addCase(getFriendRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getFriendRequests.fulfilled,
        (state, action: PayloadAction<FriendRequest[]>) => {
          state.loading = false;
          state.friendRequests = action.payload;
        }
      )
      .addCase(getFriendRequests.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setModalOpen, reset } = friendRequestsSlice.actions;

export const selectFriendRequests = (state: RootState) =>
  state.friendRequests.friendRequests;

export const selectFriendRequestIsModalOpen = (state: RootState) =>
  state.friendRequests.isModalOpen;

export default friendRequestsSlice.reducer;

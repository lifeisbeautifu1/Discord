import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Friend, FriendRequest } from "../../types";
import { GetFriendRequestsData } from "./friends.service";
import {
  sendFriendRequest,
  getFriendRequests,
  cancelFriendRequest,
  rejectFriendRequest,
  acceptFriendRequest,
  getFriends,
  deleteFriend,
} from "./friends.thunks";

export type FriendsState = {
  error: boolean;
  loading: boolean;
  success: boolean;
  friendRequests: Array<FriendRequest>;
  incomingFriendRequests: Array<FriendRequest>;
  outgoingFriendRequests: Array<FriendRequest>;
  friends: Array<Friend>;
  onlineFriends: Array<Friend>;
  offlineFriends: Array<Friend>;
  selectedFriends: Array<Friend>;
  isModalOpen: boolean;
  u_name: string;
  isRemoveFriendModal: boolean;
  friendToDelete: Friend | null;
};

const initialState: FriendsState = {
  error: false,
  loading: false,
  success: false,
  friendRequests: [],
  incomingFriendRequests: [],
  outgoingFriendRequests: [],
  friends: [],
  onlineFriends: [],
  offlineFriends: [],
  selectedFriends: [],
  isModalOpen: false,
  u_name: "",
  isRemoveFriendModal: false,
  friendToDelete: null,
};

export const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
    reset: (state) => {
      state.error = false;
      state.success = false;
    },
    setRemoveFriendModal: (state, action: PayloadAction<boolean>) => {
      state.isRemoveFriendModal = action.payload;
    },
    setFriendToDelete: (state, action: PayloadAction<Friend | null>) => {
      state.friendToDelete = action.payload;
    },
    addIncomingFriendRequest: (state, action: PayloadAction<FriendRequest>) => {
      state.friendRequests.unshift(action.payload);
      state.incomingFriendRequests.unshift(action.payload);
    },
    removeIncomingFriendRequest: (
      state,
      action: PayloadAction<FriendRequest>
    ) => {
      state.friendRequests = state.friendRequests.filter(
        (fr) => fr.id !== action.payload.id
      );
      state.incomingFriendRequests = state.incomingFriendRequests.filter(
        (fr) => fr.id !== action.payload.id
      );
    },
    removeOutgoingFriendRequest: (
      state,
      action: PayloadAction<FriendRequest>
    ) => {
      state.friendRequests = state.friendRequests.filter(
        (fr) => fr.id !== action.payload.id
      );
      state.outgoingFriendRequests = state.outgoingFriendRequests.filter(
        (fr) => fr.id !== action.payload.id
      );
    },
    addFriend: (state, action: PayloadAction<Friend>) => {
      state.friends.unshift(action.payload);
    },
    removeFriend: (state, action: PayloadAction<Friend>) => {
      state.friends = state.friends.filter(
        (friend) => friend.id !== action.payload.id
      );
      state.onlineFriends = state.onlineFriends.filter(
        (friend) => friend.id !== action.payload.id
      );
      state.offlineFriends = state.offlineFriends.filter(
        (friend) => friend.id !== action.payload.id
      );
    },
    setOnlineFriends: (state, action: PayloadAction<Array<Friend>>) => {
      state.onlineFriends = action.payload;
    },
    setOfflineFriends: (state) => {
      state.offlineFriends = state.friends.filter(
        (friend) =>
          !state.onlineFriends.map((friend) => friend.id).includes(friend.id)
      );
    },
    resetSelectedFriends: (state) => {
      state.selectedFriends = [];
    },
    toggleSelectedFriend: (state, action: PayloadAction<Friend>) => {
      state.selectedFriends = state.selectedFriends.find(
        (fr) => fr.id === action.payload.id
      )
        ? state.selectedFriends.filter(
            (friend) => friend.id !== action.payload.id
          )
        : [...state.selectedFriends, action.payload];
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
          state.outgoingFriendRequests.unshift(action.payload);
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
        (state, action: PayloadAction<GetFriendRequestsData>) => {
          state.loading = false;
          state.friendRequests = action.payload.friendRequests;
          state.incomingFriendRequests = action.payload.incomingFriendRequests;
          state.outgoingFriendRequests = action.payload.outgoingFriendRequests;
        }
      )
      .addCase(getFriendRequests.rejected, (state) => {
        state.loading = false;
      })
      .addCase(cancelFriendRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        cancelFriendRequest.fulfilled,
        (state, action: PayloadAction<FriendRequest>) => {
          state.friendRequests = state.friendRequests.filter(
            (fr) => fr.id !== action.payload.id
          );
          state.outgoingFriendRequests = state.outgoingFriendRequests.filter(
            (fr) => fr.id !== action.payload.id
          );
          state.loading = false;
        }
      )
      .addCase(cancelFriendRequest.rejected, (state) => {
        state.loading = false;
      })
      .addCase(rejectFriendRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        rejectFriendRequest.fulfilled,
        (state, action: PayloadAction<FriendRequest>) => {
          state.friendRequests = state.friendRequests.filter(
            (fr) => fr.id !== action.payload.id
          );
          state.incomingFriendRequests = state.incomingFriendRequests.filter(
            (fr) => fr.id !== action.payload.id
          );
          state.loading = false;
        }
      )
      .addCase(rejectFriendRequest.rejected, (state) => {
        state.loading = false;
      })
      .addCase(acceptFriendRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        acceptFriendRequest.fulfilled,
        (
          state,
          action: PayloadAction<{
            newFriend: Friend;
            friendRequest: FriendRequest;
          }>
        ) => {
          state.friendRequests = state.friendRequests.filter(
            (fr) => fr.id !== action.payload.friendRequest.id
          );
          state.incomingFriendRequests = state.incomingFriendRequests.filter(
            (fr) => fr.id !== action.payload.friendRequest.id
          );
          state.friends.unshift(action.payload.newFriend);
          // state.offlineFriends.unshift(action.payload.newFriend);
          state.loading = false;
        }
      )
      .addCase(acceptFriendRequest.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getFriends.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getFriends.fulfilled,
        (state, action: PayloadAction<Array<Friend>>) => {
          state.friends = action.payload;
          state.offlineFriends = action.payload.filter(
            (friend) =>
              !state.onlineFriends
                .map((friend) => friend.id)
                .includes(friend.id)
          );
          state.loading = false;
        }
      )
      .addCase(getFriends.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteFriend.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        deleteFriend.fulfilled,
        (state, action: PayloadAction<Friend>) => {
          state.friends = state.friends.filter(
            (friend) => friend.id !== action.payload.id
          );
          state.onlineFriends = state.onlineFriends.filter(
            (friend) => friend.id !== action.payload.id
          );
          state.offlineFriends = state.offlineFriends.filter(
            (friend) => friend.id !== action.payload.id
          );
          state.loading = false;
        }
      )
      .addCase(deleteFriend.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setModalOpen,
  reset,
  setRemoveFriendModal,
  setFriendToDelete,
  addIncomingFriendRequest,
  removeIncomingFriendRequest,
  removeOutgoingFriendRequest,
  addFriend,
  removeFriend,
  setOnlineFriends,
  setOfflineFriends,
  toggleSelectedFriend,
  resetSelectedFriends,
} = friendsSlice.actions;

export const selectAllFriends = (state: RootState) => state.friends.friends;

export const selectFriendRequests = (state: RootState) =>
  state.friends.friendRequests;

export const selectFriendRequestIsModalOpen = (state: RootState) =>
  state.friends.isModalOpen;

export default friendsSlice.reducer;

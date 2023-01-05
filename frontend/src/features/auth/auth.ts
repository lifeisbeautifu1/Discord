import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Errors, User } from "../../types";
import {
  login,
  register,
  getMe,
  logout,
  verifyEmail,
  passwordEmail,
  passwordReset,
  resendEmailVerification,
} from "./auth.thunks";

export type AuthState = {
  isAuth: boolean;
  user: User;
  errors: Errors;
  loading: boolean;

  isAuthModalOpen: boolean;
  isEmailModalOpen: boolean;
  modalEmail: string;
};

const initialState: AuthState = {
  isAuth: false,
  user: null,
  errors: null,
  loading: false,

  isAuthModalOpen: false,
  isEmailModalOpen: false,
  modalEmail: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setErrors: (state, action: PayloadAction<Errors>) => {
      state.errors = action.payload;
    },
    setAuthModal: (state, action: PayloadAction<boolean>) => {
      state.isAuthModalOpen = action.payload;
    },
    setEmailModal: (state, action: PayloadAction<boolean>) => {
      state.isEmailModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuth = true;
        state.errors = null;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action: any) => {
        state.errors = action.payload;
        state.isAuth = false;
        state.user = null;
        state.loading = false;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuth = true;
        state.errors = null;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action: any) => {
        state.errors = action.payload;
        state.isAuth = false;
        state.user = null;
        state.loading = false;
      })
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuth = true;
        state.loading = false;
      })
      .addCase(getMe.rejected, (state) => {
        state.isAuth = false;
        state.user = null;
        state.loading = false;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuth = false;
        state.user = null;
        state.loading = false;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.errors = null;
      })
      .addCase(verifyEmail.rejected, (state, action: any) => {
        state.errors = action.payload;
        state.loading = false;
      })
      .addCase(passwordEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        passwordEmail.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.modalEmail = action.payload;
          state.isAuthModalOpen = true;
          state.errors = null;
        }
      )
      .addCase(passwordEmail.rejected, (state, action: any) => {
        state.errors = action.payload;
        state.loading = false;
      })
      .addCase(passwordReset.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        passwordReset.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
          state.isAuth = true;
          state.loading = false;
          state.errors = null;
        }
      )
      .addCase(passwordReset.rejected, (state, action: any) => {
        state.errors = action.payload;
        state.loading = false;
      })
      .addCase(resendEmailVerification.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendEmailVerification.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendEmailVerification.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setErrors, setAuthModal, setEmailModal } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;

export const selectErrors = (state: RootState) => state.auth.errors;

export const selectIsAuth = (state: RootState) => state.auth.isAuth;

export const selectLoading = (state: RootState) => state.auth.loading;

export const selectIsEmailModal = (state: RootState) =>
  state.auth.isEmailModalOpen;

export default authSlice.reducer;

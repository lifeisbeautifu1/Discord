import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { login, register, getMe } from "./auth.thunks";

export type AuthState = {
  isAuth: boolean;
  user: User;
  errors: Errors;
  loading: boolean;
};

const initialState: AuthState = {
  isAuth: false,
  user: null,
  errors: null,
  loading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
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
        state.errors = null;
        state.loading = false;
      })
      .addCase(getMe.rejected, (state, action: any) => {
        state.isAuth = false;
        state.user = null;
        state.loading = false;
      });
  },
});

export const selectUser = (state: RootState) => state.auth.user;

export const selectErrors = (state: RootState) => state.auth.errors;

export const selectIsAuth = (state: RootState) => state.auth.isAuth;

export const selectLoading = (state: RootState) => state.auth.loading;

export default authSlice.reducer;

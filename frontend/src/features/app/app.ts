import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type AppState = {
  counter: number;
};

const initialState: AppState = {
  counter: 0,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    increment: (state: AppState) => {
      state.counter++;
    },
    decrement: (state: AppState) => {
      state.counter--;
    },
    incrementByAmount: (state: AppState, action: PayloadAction<number>) => {
      state.counter += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = appSlice.actions;

export default appSlice.reducer;

export const selectCounter = (state: RootState) => state.app.counter;

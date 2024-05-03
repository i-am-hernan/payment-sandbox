import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Session } from "../types";

const initialState: Session = {
  login: false,
};

export const sessionSlice = createSlice({
  name: "Session",
  initialState,
  reducers: {
    updateSession: (state, action: PayloadAction<Session>) => {
      return { ...state, ...action.payload };
    },
    clearSession: (state) => {
      return initialState;
    },
  },
});

export const { actions, reducer } = sessionSlice;

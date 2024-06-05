import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the state
export interface Sandbox {
  theme: "dark" | "light";
  section: "frontend" | "backend" | "webhooks";
  isRedirect: boolean;
  unsavedChanges: number;
}

// Define the initial state
const initialState: Sandbox = {
  theme: "dark",
  section: "frontend",
  isRedirect: false,
  unsavedChanges: 0
};

// Create the slice with typed reducers
const sandboxSlice = createSlice({
  name: "sandbox",
  initialState,
  reducers: {
    updateSandbox: (state, action: PayloadAction<Partial<any>>) => {
      return { ...state, ...action.payload };
    },
    updateSandboxTheme: (state, action: PayloadAction<"dark" | "light">) => {
      state.theme = action.payload;
    },
    updateSandboxSection: (
      state,
      action: PayloadAction<"frontend" | "backend" | "webhooks">
    ) => {
      state.section = action.payload;
    },
    updateIsRedirect: (state, action: PayloadAction<boolean>) => {
      state.isRedirect = action.payload;
    },
    incrementUnsavedChanges: (state) => {
      state.unsavedChanges += 1;
    },
    resetSandbox: (state) => {
      return { ...initialState };
    },
  },
});

// Export actions and reducer
export const { actions, reducer } = sandboxSlice;

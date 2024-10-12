import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for properties that can be of any shape
export interface FormulaPropType {
  [key: string]: any;
}

// Define the shape of the state
export interface User {
  merchantAccount: FormulaPropType;
  defaultMerchantAccount: FormulaPropType;
}

// Define the initial state
const initialState: FormulaPropType = {
  merchantAccount: "HernanTest",
  defaultMerchantAccount: "test",
};

// Create the slice with typed reducers
const formulaSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateMerchantAccount: (state, action: PayloadAction<string>) => {
      state.merchantAccount = action.payload;
    },
  },
});

// Export actions and reducer
export const { actions, reducer } = formulaSlice;

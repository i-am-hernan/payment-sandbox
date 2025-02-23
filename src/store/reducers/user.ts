import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for properties that can be of any shape
export interface FormulaPropType {
  [key: string]: any;
}

// Define the shape of the state
export interface User {
  merchantAccount: FormulaPropType;
  defaultMerchantAccount: FormulaPropType;
  theme: "light" | "dark";
  view: "developer" | "preview" | "demo";
}

// Define the initial state
const initialState: FormulaPropType = {
  merchantAccount: null,
  defaultMerchantAccount: `${process.env.NEXT_PUBLIC_MERCHANT_ACCOUNT}`,
  theme: "light",
  view: "preview",
};

// Create the slice with typed reducers
const formulaSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateMerchantAccount: (state, action: PayloadAction<string>) => {
      state.merchantAccount = action.payload;
    },
    updateDefaultMerchantAccount: (state, action: PayloadAction<string>) => {
      state.defaultMerchantAccount = action.payload;
    },
    updateTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    updateView: (
      state,
      action: PayloadAction<"developer" | "preview" | "demo">
    ) => {
      state.view = action.payload;
    },
  },
});

// Export actions and reducer
export const { actions, reducer } = formulaSlice;

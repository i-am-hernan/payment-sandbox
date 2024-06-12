import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for properties that can be of any shape
export interface AdyenVariantPropType {
  [key: string]: any;
}

// Define the shape of the state
export interface AdyenVariant {
  variantState: AdyenVariantPropType;
}

// Define the initial state
const initialState: AdyenVariant = {
  variantState: {},
};

// Create the slice with typed reducers
const variantSlice = createSlice({
  name: "AdyenVariant",
  initialState,
  reducers: {
    updateAdyenVariant: (state, action: PayloadAction<Partial<AdyenVariant>>) => {
      return { ...state, ...action.payload };
    },
    updateVariantState: (
      state,
      action: PayloadAction<AdyenVariantPropType>
    ) => {
      state.variantState = action.payload;
    },
    clearAdyenVariant: (state) => {
      return { ...initialState };
    },
  },
});

// Export actions and reducer
export const { actions, reducer } = variantSlice;

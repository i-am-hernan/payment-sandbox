import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Specs {
  [key: string]: any;
}

export interface SpecsList {
  checkoutApi?: Specs | null;
  adyenWeb?: Specs | null;
}

const initialState: SpecsList = {
  checkoutApi: null,
  adyenWeb: null,
};

export const SpecsSlice = createSlice({
  name: "Adyen Integration Parameters",
  initialState,
  reducers: {
    updateSpecs: (state, action: PayloadAction<SpecsList>) => {
      return { ...state, ...action.payload };
    },
    clearSpecs: (state) => {
      state = initialState;
    },
  },
});

export const { actions, reducer } = SpecsSlice;

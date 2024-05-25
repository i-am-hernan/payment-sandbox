import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for properties that can be of any shape
export interface CurrentFormulaPropType {
  [key: string]: any;
}

// Define the shape of the state
export interface CurrentFormula {
  checkoutConfiguration: CurrentFormulaPropType;
  checkoutAPIVersion: string;
  adyenWebVersion: string;
  txVariantConfiguration: CurrentFormulaPropType;
  txVariant: string;
  sessionsRequest: CurrentFormulaPropType;
  sessionsResponse: CurrentFormulaPropType;
  paymentMethodsRequest: CurrentFormulaPropType;
  paymentMethodsResponse: CurrentFormulaPropType;
  paymentsRequest: CurrentFormulaPropType;
  paymentsResponse: CurrentFormulaPropType;
  paymentsDetailsRequest: CurrentFormulaPropType;
  paymentsDetailsResponse: CurrentFormulaPropType;
  isRedirect: boolean;
  style?: CurrentFormulaPropType;
  [key: string]: any;
}

// Define the initial state
const initialState: CurrentFormula = {
  checkoutConfiguration: {},
  checkoutAPIVersion: "",
  adyenWebVersion: "",
  txVariantConfiguration: {},
  txVariant: "",
  sessionsRequest: {},
  sessionsResponse: {},
  paymentMethodsRequest: {},
  paymentMethodsResponse: {},
  paymentsRequest: {},
  paymentsResponse: {},
  paymentsDetailsRequest: {},
  paymentsDetailsResponse: {},
  isRedirect: false,
  style: {},
};

// Create the slice with typed reducers
const formulaSlice = createSlice({
  name: "formula",
  initialState,
  reducers: {
    updateFormula: (state, action: PayloadAction<Partial<CurrentFormula>>) => {
      return { ...state, ...action.payload };
    },
    updateCheckoutConfiguration: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.checkoutConfiguration = action.payload;
    },
    updateCheckoutAPIVersion: (
      state,
      action: PayloadAction<string>
    ) => {
      state.checkoutAPIVersion = action.payload;
    },
    updateAdyenWebVersion: (
      state,
      action: PayloadAction<string>
    ) => {
      state.adyenWebVersion = action.payload;
    },
    updateTxVariantConfiguration: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.txVariantConfiguration = action.payload;
    },
    updateTxVariant: (
      state,
      action: PayloadAction<string>
    ) => {
      state.txVariant = action.payload;
    },
    updateSessionsRequest: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.sessionsRequest = action.payload;
    },
    updateSessionsResponse: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.sessionsResponse = action.payload;
    },
    updatePaymentMethodsRequest: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.paymentMethodsRequest = action.payload;
    },
    updatePaymentMethodsResponse: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.paymentMethodsResponse = action.payload;
    },
    updatePaymentsRequest: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.paymentsRequest = action.payload;
    },
    updatePaymentsResponse: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.paymentsResponse = action.payload;
    },
    updatePaymentsDetailsRequest: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.paymentsDetailsRequest = action.payload;
    },
    updatePaymentsDetailsResponse: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.paymentsDetailsResponse = action.payload;
    },
    updateIsRedirect: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isRedirect = action.payload;
    },
    clearOnDeckInfo: (state) => {
      const { txVariant } = state;
      return { ...initialState, txVariant };
    },
  },
});

// Export actions and reducer
export const { actions, reducer } = formulaSlice;

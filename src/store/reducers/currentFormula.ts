import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for properties that can be of any shape
export interface CurrentFormulaPropType {
  [key: string]: any;
}

// Define the shape of the state
export interface CurrentFormula {
  checkoutConfiguration: CurrentFormulaPropType;
  checkoutAPIVersion: "67" | "68" | "69" | "70";
  adyenWebVersion: string;
  txVariant: string;
  txVariantConfiguration: CurrentFormulaPropType;
  sessionsRequest: CurrentFormulaPropType;
  paymentMethodsRequest: CurrentFormulaPropType;
  paymentsRequest: CurrentFormulaPropType;
  paymentsDetailsRequest: CurrentFormulaPropType;
  style: CurrentFormulaPropType;
  isRedirect: boolean;
  unsavedChanges: number;
  lastBuild: [CurrentFormula] | null;
  runBuild: boolean;
  redirectResult: string | null;
}

// Define the initial state
const initialState: CurrentFormula = {
  checkoutAPIVersion: "70",
  adyenWebVersion: "5.60.0",
  checkoutConfiguration: {
    clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY,
    environment: "test",
  },
  txVariant: "dropin",
  txVariantConfiguration: {},
  sessionsRequest: {},
  paymentMethodsRequest: {
    shopperReference: "Hernan",
  },
  paymentsRequest: {
    countryCode: "US",
    amount: {
      value: 1000,
      currency: "USD",
    },
    channel: "Web",
    returnUrl: "http://localhost:3000/advanced/dropin",
    reference: "reference",
    shopperLocale: "en_US",
    merchantAccount: "HernanChalco",
  },
  paymentsDetailsRequest: {},
  style: {},
  unsavedChanges: 0,
  isRedirect: false,
  lastBuild: null,
  runBuild: true,
  redirectResult: null,
};

// Create the slice with typed reducers
const formulaSlice = createSlice({
  name: "formula",
  initialState,
  reducers: {
    updateRunBuild: (state) => {
      state.runBuild = !state.runBuild;
    },
    updateFormula: (state, action: PayloadAction<Partial<CurrentFormula>>) => {
      return { ...state, ...action.payload };
    },
    updateCheckoutConfiguration: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.checkoutConfiguration = action.payload;
    },
    addUnsavedChanges: (state) => {
      state.unsavedChanges += 1;
    },
    resetUnsavedChanges: (state) => {
      state.unsavedChanges = 0;
    },
    updateCheckoutAPIVersion: (
      state,
      action: PayloadAction<"67" | "68" | "69" | "70">
    ) => {
      state.checkoutAPIVersion = action.payload;
    },
    updateAdyenWebVersion: (state, action: PayloadAction<string>) => {
      state.adyenWebVersion = action.payload;
    },
    updateIsRedirect: (state, action: PayloadAction<boolean>) => {
      state.isRedirect = action.payload;
    },
    updateRedirectResult: (state, action: PayloadAction<string>) => {
      state.redirectResult = action.payload;
    },
    updateTxVariant: (state, action: PayloadAction<string>) => {
      state.txVariant = action.payload;
    },
    updateTxVariantConfiguration: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.txVariantConfiguration = action.payload;
    },
    updateSessionsRequest: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.sessionsRequest = action.payload;
    },
    updatePaymentMethodsRequest: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.paymentMethodsRequest = action.payload;
    },
    updatePaymentsRequest: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.paymentsRequest = action.payload;
    },
    updatePaymentsDetailsRequest: (
      state,
      action: PayloadAction<CurrentFormulaPropType>
    ) => {
      state.paymentsDetailsRequest = action.payload;
    },
    clearOnDeckInfo: (state) => {
      return { ...initialState };
    },
  },
});

// Export actions and reducer
export const { actions, reducer } = formulaSlice;

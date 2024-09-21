import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for properties that can be of any shape
export interface FormulaPropType {
  [key: string]: any;
}

// Define the shape of the state
export interface Formula {
  checkoutConfiguration: FormulaPropType;
  checkoutAPIVersion: {
    sessions: string;
    paymentMethods: string;
    payments: string;
    paymentsDetails: string;
  };
  adyenWebVersion: string;
  txVariant: string;
  txVariantConfiguration: FormulaPropType;
  request: {
    sessions: FormulaPropType;
    paymentMethods: FormulaPropType;
    payments: FormulaPropType;
    paymentsDetails: FormulaPropType;
  };
  style: FormulaPropType;
  isRedirect: boolean;
  unsavedChanges: {
    html: boolean;
    style: boolean;
    js: boolean;
    paymentMethods: boolean;
    payments: boolean;
    paymentDetails: boolean;
    events: boolean;
  };
  build: Formula | null;
  run: boolean;
  redirectResult: string | null;
}

// Define the initial state
const initialState: FormulaPropType = {
  checkoutAPIVersion: {
    paymentMethods: "70",
    payments: "70",
    paymentDetails: "70",
  },
  adyenWebVersion: "5.66.1",
  checkoutConfiguration: {
    clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY,
    environment: "test",
  },
  txVariant: "",
  txVariantConfiguration: {},
  sessions: {},
  request: {
    paymentMethods: {
      shopperReference: "Hernan",
    },
    payments: {
      countryCode: "NL",
      amount: {
        value: 10000,
        currency: "EUR",
      },
      channel: "Web",
      returnUrl: "http://localhost:3000/advanced/dropin",
      reference: "reference",
      shopperLocale: "en_US",
      merchantAccount: "HernanChalco",
    },
    paymentsDetails: {},
  },
  style: {},
  unsavedChanges: {
    html: false,
    style: false,
    js: false,
    paymentMethods: false,
    payments: false,
    paymentDetails: false,
    events: false,
  },
  isRedirect: false,
  build: null,
  run: true,
  redirectResult: null,
};

// Add the build key to the initial state
initialState.build = { ...initialState };

// Create the slice with typed reducers
const formulaSlice = createSlice({
  name: "formula",
  initialState,
  reducers: {
    updateRun: (state) => {
      state.build = { ...state };
      state.run = !state.run;
    },
    updateFormula: (state, action: PayloadAction<Partial<Formula>>) => {
      return { ...state, ...action.payload };
    },
    updateCheckoutConfiguration: (
      state,
      action: PayloadAction<FormulaPropType>
    ) => {
      state.checkoutConfiguration = action.payload;
    },
    addUnsavedChanges: (state, action: PayloadAction<any>) => {
      state.unsavedChanges = {
        ...state.unsavedChanges,
        ...action.payload,
      };
    },
    resetUnsavedChanges: (state) => {
      state.unsavedChanges = {
        html: false,
        style: false,
        js: false,
        paymentMethods: false,
        payments: false,
        paymentDetails: false,
        events: false,
      };
    },
    updateCheckoutAPIVersion: (state, action: PayloadAction<any>) => {
      state.checkoutAPIVersion = {
        ...state.checkoutAPIVersion,
        ...action.payload,
      };
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
      action: PayloadAction<FormulaPropType>
    ) => {
      state.txVariantConfiguration = action.payload;
    },
    updateSessionsRequest: (state, action: PayloadAction<FormulaPropType>) => {
      const updatedRequest = {
        ...action.payload,
      };
      return {
        ...state,
        request: {
          ...state.request,
          sessions: updatedRequest,
        },
      };
    },
    updatePaymentMethodsRequest: (
      state,
      action: PayloadAction<FormulaPropType>
    ) => {
      const updatedRequest = {
        ...action.payload,
      };
      return {
        ...state,
        request: {
          ...state.request,
          paymentMethods: updatedRequest,
        },
      };
    },
    updatePaymentsRequest: (state, action: PayloadAction<FormulaPropType>) => {
      const updatedRequest = {
        ...action.payload,
      };
      return {
        ...state,
        request: {
          ...state.request,
          payments: updatedRequest,
        },
      };
    },
    updatePaymentsDetailsRequest: (
      state,
      action: PayloadAction<FormulaPropType>
    ) => {
      const updatedRequest = {
        ...action.payload,
      };
      return {
        ...state,
        request: {
          ...state.request,
          paymentsDetails: updatedRequest,
        },
      };
    },
    clearOnDeckInfo: (state) => {
      const lastBuild = state.build;
      return {
        ...lastBuild,
        build: lastBuild,
        run: state.run,
        unsavedChanges: {
          html: false,
          style: false,
          js: false,
          paymentMethods: false,
          payments: false,
          paymentDetails: false,
          events: false,
        },
      };
    },
  },
});

// Export actions and reducer
export const { actions, reducer } = formulaSlice;

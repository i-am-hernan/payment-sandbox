import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sanitizeString } from "@/utils/utils";

// Define the types for properties that can be of any shape
export interface FormulaPropType {
  [key: string]: any;
}

// Define the shape of the state
export interface Formula {
  checkoutConfiguration: string;
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
    paymentsDetails: boolean;
    sessions: boolean;
    events: boolean;
  };
  build: Formula | null;
  base: Formula | null;
  run: boolean;
  reset: boolean;
  redirectResult: string | null;
  sessionId: string | null;
}

// Define the initial state

const initialState: FormulaPropType = {
  checkoutAPIVersion: {
    paymentMethods: "70",
    payments: "70",
    paymentsDetails: "70",
    sessions: "70",
  },
  adyenWebVersion: "5.66.1",
  checkoutConfiguration: sanitizeString(
    `{clientKey: "test_747LMAMEOFBGRIEKENIJNYWAZM34XT5N", environment: "test", onError: function(error){handleError(error);}, onAdditionalDetails: function(state,dropin){handleAdditionalDetails(state,dropin);}, onSubmit: function(state,dropin){handleSubmit(state,dropin);}}`
  ),
  txVariant: "",
  txVariantConfiguration: {},
  request: {
    paymentMethods: {
      merchantAccount: `${process.env.NEXT_PUBLIC_MERCHANT_ACCOUNT}`,
    },
    payments: {
      countryCode: "US",
      amount: {
        value: 10000,
        currency: "USD",
      },
      returnUrl: `${process.env.NEXT_PUBLIC_CLIENT_URL}/advanced/dropin`,
      reference: "merchant-reference",
      merchantAccount: "HernanChalco",
    },
    paymentsDetails: {},
    sessions: {
      countryCode: "US",
      amount: {
        value: 10000,
        currency: "USD",
      },
      channel: "Web",
      //TODO: Refactor this
      returnUrl: "http://localhost:3000/sessions/ideal",
      reference: "reference",
      shopperLocale: "en_US",
      //TODO: Fix this
      merchantAccount: "HernanChalco",
    },
  },
  style: {},
  unsavedChanges: {
    html: false,
    style: false,
    js: false,
    paymentMethods: false,
    payments: false,
    paymentsDetails: false,
    sessions: false,
    events: false,
  },
  isRedirect: false,
  build: null,
  base: null,
  run: true,
  reset: false,
  redirectResult: null,
  sessionId: null,
};

// Add the build key to the initial state
initialState.build = { ...initialState };
initialState.base = { ...initialState };

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
    updateCheckoutConfiguration: (state, action: PayloadAction<string>) => {
      state.checkoutConfiguration = action.payload;
    },
    addUnsavedChanges: (state, action: PayloadAction<any>) => {
      state.unsavedChanges = {
        ...state.unsavedChanges,
        ...action.payload,
      };
    },
    updateReset: (state, action: PayloadAction<any>) => {
      state.reset = action.payload;
    },
    resetUnsavedChanges: (state) => {
      state.unsavedChanges = {
        html: false,
        style: false,
        js: false,
        paymentMethods: false,
        payments: false,
        paymentsDetails: false,
        sessions: false,
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
    updateSessionId: (state, action: PayloadAction<string | null>) => {
      state.sessionId = action.payload;
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
    resetFormula: (state) => {
      const baseConfiguration = state.base;
      return {
        ...baseConfiguration,
        base: baseConfiguration,
        run: !state.run,
        reset: state.reset,
        unsavedChanges: {
          html: false,
          style: false,
          js: false,
          paymentMethods: false,
          payments: false,
          paymentsDetails: false,
          sessions: false,
          events: false,
        },
      };
    },
    clearOnDeckInfo: (state) => {
      const lastBuild = state.build;
      return {
        ...lastBuild,
        build: lastBuild,
        run: state.run,
        base: state.base,
        reset: state.reset,
        unsavedChanges: {
          html: false,
          style: false,
          js: false,
          paymentMethods: false,
          payments: false,
          paymentsDetails: false,
          sessions: false,
          events: false,
        },
      };
    },
  },
});

// Export actions and reducer
export const { actions, reducer } = formulaSlice;

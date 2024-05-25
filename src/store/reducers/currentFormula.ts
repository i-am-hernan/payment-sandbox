import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CurrentFormulaPropType {
  [key: string]: any;
}

export type StepsType = "checkout" | "local" | "sessions" | "review";

export interface CurrentFormula {
  checkoutConfiguration: CurrentFormulaPropType | {};
  checkoutAPIVersion: string;
  adyenWebVersion: string;
  txVariantConfiguration: CurrentFormulaPropType | {};
  txVariant: string;
  sessionsRequest: CurrentFormulaPropType | {};
  sessionsResponse: CurrentFormulaPropType | {};
  paymentMethodsRequest: CurrentFormulaPropType | {};
  paymentsRequest: CurrentFormulaPropType | {};
  paymentsDetailsRequest: CurrentFormulaPropType | {};
  isRedirect: boolean;
  style: CurrentFormulaPropType | {};
  theme?: string;
  [key: string]: any;
}
// The initial state will be empty and then populated by an API call to retrieve the default formula
const initialFormula: CurrentFormula = {
  checkoutConfiguration: {},
  local: {},
  sessions: {},
  defaultSessionProps: {},
  sessionsResponse: {},
  products: {},
  txVariant: "",
  isRedirect: false,
  style: {},
  adyenState: {},
  theme: localStorage.getItem("style") || "dark",
};

const onDeckSlice = createSlice({
  name: "onDeck",
  initialFormula,
  reducers: {
    updateCheckoutInfo: (state, action: PayloadAction<OnDeckPropType>) => {
      state.checkout = action.payload;
    },
    updateLocalInfo: (state, action: PayloadAction<OnDeckPropType>) => {
      state.local = action.payload;
    },
    updateSessionsInfo: (state, action: PayloadAction<OnDeckPropType>) => {
      state.sessions = action.payload;
    },
    updateDefaultSessionProps: (
      state,
      action: PayloadAction<OnDeckPropType>
    ) => {
      state.defaultSessionProps = action.payload;
    },
    updateRedirectInfo: (state, action: PayloadAction<any>) => {
      state.isRedirect = action.payload;
    },
    updateTxVariant: (state, action: PayloadAction<string>) => {
      state.txVariant = action.payload;
    },
    updateSteps: (state, action: PayloadAction<any>) => {
      state.steps = action.payload;
    },
    updateActiveStep: (state, action: PayloadAction<any>) => {
      state.activeStep = action.payload;
    },
    updateSessionsResponseInfo: (state, action: PayloadAction<any>) => {
      state.sessionsResponse = action.payload;
    },
    updateStyleInfo: (state, action: PayloadAction<any>) => {
      state.style = action.payload;
    },
    updateAdyenStateInfo: (state, action: PayloadAction<any>) => {
      state.adyenState = action.payload;
    },
    updateProductsInfo: (state, action: PayloadAction<any>) => {
      state.products = action.payload;
    },
    updateTheme: (state, action: PayloadAction<any>) => {
      localStorage.setItem("style", action.payload);
      state.theme = action.payload;
    },
    resetOnDeckInfo: (state) => {
      const { defaultSessionProps, products, txVariant, theme } = state;
      const style =
        txVariant === "dropin" ? defaultDropinStyle : defaultComponentStyle;
      // console.log('resetOnDeckInfo', state.defaultSessionProps);
      // state.sessions = { sessions: defaultSessionProps };
      return {
        ...initialFormula,
        defaultSessionProps,
        theme,
        style,
        products,
        txVariant,
      };
    },
    clearOnDeckInfo: (state) => {
      let { products } = state;
      return { ...initialFormula, products };
    },
  },
});

export const { actions, reducer } = onDeckSlice;

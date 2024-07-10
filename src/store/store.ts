import { configureStore } from "@reduxjs/toolkit";
import {
  adyenParametersReducer,
  adyenVariantReducer,
  currentFormulaReducer,
  sandboxReducer,
} from "./reducers";

export const store = configureStore({
  reducer: {
    currentFormula: currentFormulaReducer,
    adyenParameters: adyenParametersReducer,
    adyenVariant: adyenVariantReducer,
    sandbox: sandboxReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

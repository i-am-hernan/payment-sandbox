import { configureStore } from "@reduxjs/toolkit";
import {
  adyenParametersReducer,
  adyenVariantReducer,
  formulaReducer,
  sandboxReducer,
} from "./reducers";

export const store = configureStore({
  reducer: {
    formula: formulaReducer,
    adyenParameters: adyenParametersReducer,
    adyenVariant: adyenVariantReducer,
    sandbox: sandboxReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

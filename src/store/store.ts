import { configureStore } from "@reduxjs/toolkit";
import {
  specsReducer,
  adyenVariantReducer,
  formulaReducer,
  sandboxReducer,
} from "./reducers";

export const store = configureStore({
  reducer: {
    formula: formulaReducer,
    specs: specsReducer,
    adyenVariant: adyenVariantReducer,
    sandbox: sandboxReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

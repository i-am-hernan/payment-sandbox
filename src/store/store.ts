import { configureStore } from '@reduxjs/toolkit';
import { currentFormulaReducer, adyenParametersReducer } from './reducers';

export const store = configureStore({
  reducer: {
    currentFormula: currentFormulaReducer,
    adyenParameters: adyenParametersReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

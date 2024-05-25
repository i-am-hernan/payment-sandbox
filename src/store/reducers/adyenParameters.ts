import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AdyenParameter {
  name: string;
  description: string;
  properties?: [];
  items?: { type: string } | [];
  type?: string;
  format?: string;
  [key: string]: any;
}

export interface AdyenParameterList {
  checkout: AdyenParameter[] | [];
  local: AdyenParameter[] | [];
  sessions: AdyenParameter[] | [];
  [key: string]: AdyenParameter[] | [];
}

const initialState: AdyenParameterList = {
  checkout: [],
  local: [],
  sessions: []
};

export const AdyenParametersSlice = createSlice({
  name: 'Adyen Integration Parameters',
  initialState,
  reducers: {
    updateAdyenParameters: (state, action: PayloadAction<AdyenParameterList>) => {
      state.checkout = [...new Set([...action.payload.checkoutConfig])];
      state.local = action.payload.localConfig && action.payload.localConfig.length ? [...new Set([...action.payload.localConfig])] : [];
      state.sessions = [...new Set([...action.payload.sessionsConfig])];
    },
    clearAdyenParameters: state => {
      state = initialState;
    }
  }
});

export const { actions, reducer } = AdyenParametersSlice;

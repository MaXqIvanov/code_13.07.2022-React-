import { combineReducers, configureStore } from '@reduxjs/toolkit';
import proodSlice from './proodSlice';
import profileSlice from './profileSlice';
import orderSlice from './orderSlice';
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import addressSlice from './addressSlice';

const rootReducer = combineReducers({
  prood: proodSlice,
  profile: profileSlice,
  order: orderSlice,
  address: addressSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
  }),
});
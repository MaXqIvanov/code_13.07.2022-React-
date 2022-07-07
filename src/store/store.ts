import { combineReducers, configureStore } from '@reduxjs/toolkit';
import serviceSlice from './serviceSlice';
import profileSlice from './profileSlice';
import { getDefaultMiddleware } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  service: serviceSlice,
  profile: profileSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
  }),
});
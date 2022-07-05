import { combineReducers, configureStore } from '@reduxjs/toolkit';
import serviceSlice from './serviceSlice';
import profileSlice from './profileSlice';

const rootReducer = combineReducers({
  service: serviceSlice,
  profile: profileSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});
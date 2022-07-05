import { createSlice } from '@reduxjs/toolkit';

const serviceSlice = createSlice({
  name: 'service',
  initialState: {
    services: [] as any [],
  },
  reducers: {
    getServices(state, action) {
        
    },
  },
});

export default serviceSlice.reducer;
export const { getServices } =
serviceSlice.actions;
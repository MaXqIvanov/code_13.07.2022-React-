import { createSlice } from '@reduxjs/toolkit';

const proodSlice = createSlice({
  name: 'prood',
  initialState: {
    services: [] as any [],
  },
  reducers: {
    getServices(state, action) {
        
    },
  },
});

export default proodSlice.reducer;
export const { getServices } =
proodSlice.actions;
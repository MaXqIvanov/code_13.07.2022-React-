import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    services: [] as any [],
  },
  reducers: {
    getOrders(state, action) {
        
    },
  },
});

export default orderSlice.reducer;
export const { getOrders } =
orderSlice.actions;
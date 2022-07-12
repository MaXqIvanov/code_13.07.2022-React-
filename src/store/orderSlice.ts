import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../plugins/axios/api';

export const getOrdersAsync:any = createAsyncThunk(
  'order/getOrdersAsync',
  async (params:any, state:any) => { // here you have two arguments
      const response = await api('marketplace/cart/by_stores')
      return response;
  },
)

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders_prood: [] as any [],
  },
  reducers: {
    getOrders(state, action) {
        
    },
  },
  extraReducers: {
    [getOrdersAsync.pending]: (state:any, action:any) => {
    },
    [getOrdersAsync.fulfilled]: (state:any, { payload }:any) => {
      console.log(payload);
      state.orders_prood = payload.data
    },
    [getOrdersAsync.rejected]: (state:any, action: any) => {

    },
  }
});

export default orderSlice.reducer;
export const { getOrders } =
orderSlice.actions;
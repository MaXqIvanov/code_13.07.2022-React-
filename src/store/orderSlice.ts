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
    orders_add_prood: [] as any [],
  },
  reducers: {
    addOrders(state, action) {
        if(action.payload.checked){
          state.orders_add_prood = [...state.orders_add_prood, action.payload.orders];
        }else{
          state.orders_add_prood = state.orders_add_prood.filter((elem:any)=> elem.store_id !== action.payload.orders.store_id)
        }
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
export const { addOrders } =
orderSlice.actions;
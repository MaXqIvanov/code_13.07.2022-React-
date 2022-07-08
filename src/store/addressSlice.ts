import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../plugins/axios/api';

export const getCityAsync:any = createAsyncThunk(
    'address/getCityAsync',
    async (params:any, state:any) => {
        const response = await api('marketplace/cities/')
        return response
    },
  )

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    // this is info about company 
    cityES: [] as any[],
    // end info about company

    address: [] as any [],
  },
  reducers: {
    getOrders(state, action) {
        
    },
  },
  extraReducers: {
    [getCityAsync.pending]: (state:any, action:any) => {
        state.status = 'loading'
      },
    [getCityAsync.fulfilled]: (state:any, { payload }:any) => {
        state.status = 'success'
        console.log(payload);
        state.cityES = payload.data.results
    },
    [getCityAsync.rejected]: (state:any, action: any) => {
        state.status = 'failed'
    },
  },
});

export default addressSlice.reducer;
export const { getOrders } =
addressSlice.actions;
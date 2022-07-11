import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../plugins/axios/api';

export const getCategoryAsync:any = createAsyncThunk(
  'prood/getCategoryAsync',
  async (params:any, state:any) => { // here you have two arguments
      const response = await api('marketplace/categories/')
      return response;
  },
)

export const getProodAsync:any = createAsyncThunk(
  'prood/getProodAsync',
  async (params:any, state:any) => { // here you have two arguments
      console.log(params);
      const response = await api(`marketplace/products/?category=${params.id}`)
      return response;
  },
)

// work with basket ==> 
export const getProodBasketAsync:any = createAsyncThunk(
  'prood/getProodBasketAsync',
  async (params:any, state:any) => { // here you have two arguments
      const response = await api(`marketplace/cart/`)
      return response;
  },
)

export const addProodBasketAsync:any = createAsyncThunk(
  'prood/addProodBasketAsync',
  async (params:any, state:any) => { // here you have two arguments
      const response = await api.post(`marketplace/cart/change/`,{
        product: params.id,
        count: 1,
      })
      return {response, params};
  },
)

export const deleteProodBasketAsync:any = createAsyncThunk(
  'prood/deleteProodBasketAsync',
  async (params:any, state:any) => { // here you have two arguments
      const response = await api.post(`marketplace/cart/change/`,{
        product: params.id,
        count: 0,
      })
      return {response, params};
  },
)
// end work with basket <==

const proodSlice = createSlice({
  name: 'prood',
  initialState: {
    category: [] as any [],
    prood_category: [] as any[],
    prood_basket: [] as any[],
  },
  reducers: {
    getServices(state, action) {
        
    },
  },
  extraReducers: {
    [getCategoryAsync.pending]: (state:any, action:any) => {

    },
    [getCategoryAsync.fulfilled]: (state:any, { payload }:any) => {
      state.category = payload.data.results;
    },
    [getCategoryAsync.rejected]: (state:any, action: any) => {

    },

    [getProodAsync.pending]: (state:any, action:any) => {

    },
    [getProodAsync.fulfilled]: (state:any, { payload }:any) => {
      state.prood_category = payload.data.results;
    },
    [getProodAsync.rejected]: (state:any, action: any) => {

    },

    // work with basket
    [addProodBasketAsync.pending]: (state:any, action:any) => {

    },
    [addProodBasketAsync.fulfilled]: (state:any, { payload }:any) => {
      let basket = {
        ...payload.params,
        product: payload.params.id
      }
      alert(payload.response.data.detail)
      state.prood_basket = [...state.prood_basket, basket];
    },
    [addProodBasketAsync.rejected]: (state:any, action: any) => {

    },

    [getProodBasketAsync.pending]: (state:any, action:any) => {
    },
    [getProodBasketAsync.fulfilled]: (state:any, { payload }:any) => {
      state.prood_basket = payload.data.results
    },
    [getProodBasketAsync.rejected]: (state:any, action: any) => {
    },

    [deleteProodBasketAsync.pending]: (state:any, action:any) => {
    },
    [deleteProodBasketAsync.fulfilled]: (state:any, { payload }:any) => {
      alert(payload.response.data.detail);
      state.prood_basket = state.prood_basket.filter((elem:any)=> elem.product === payload.id)
    },
    [deleteProodBasketAsync.rejected]: (state:any, action: any) => {
    },
  }
});

export default proodSlice.reducer;
export const { getServices } =
proodSlice.actions;
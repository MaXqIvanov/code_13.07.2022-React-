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
    console.log(params);
      const response = await api.post(`marketplace/cart/change/`,{
        product: params.id,
        count: 0,
      })
      return {response, params};
  },
)

export const changeProodBasketAsync:any = createAsyncThunk(
  'prood/changeProodBasketAsync',
  async (params:any, state:any) => { // here you have two arguments
    let value = params.elem.count + params.amount;
    const response = await api.post(`marketplace/cart/change/`,{
      product: params.elem.product,
      count: value,
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
    count_basket: 0 as number,
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
      state.count_basket = state.count_basket + 1;
    },
    [addProodBasketAsync.rejected]: (state:any, action: any) => {

    },

    [getProodBasketAsync.pending]: (state:any, action:any) => {
    },
    [getProodBasketAsync.fulfilled]: (state:any, { payload }:any) => {
      state.prood_basket = payload.data.results
      state.count_basket = state.prood_basket.reduce((sum:any, current:any)=> sum+current.count, 0)
    },
    [getProodBasketAsync.rejected]: (state:any, action: any) => {
    },

    [deleteProodBasketAsync.pending]: (state:any, action:any) => {
    },
    [deleteProodBasketAsync.fulfilled]: (state:any, { payload }:any) => {
      state.prood_basket = state.prood_basket.filter((elem:any)=> elem.product !== payload.params.id)
      state.count_basket = state.prood_basket.reduce((sum:any, current:any)=> sum+current.count, 0)
      alert(payload.response.data.detail);
    },
    [deleteProodBasketAsync.rejected]: (state:any, action: any) => {
    },

    [changeProodBasketAsync.pending]: (state:any, action:any) => {
    },
    [changeProodBasketAsync.fulfilled]: (state:any, { payload }:any) => {
      console.log(payload.response);
      if(payload.response.status == 400){
        state.prood_basket = state.prood_basket.filter((elem:any)=> elem.id !== payload.params.elem.id)
      }
      else{
        state.prood_basket = state.prood_basket;
        let index = 0;
        for(let i = 0; i < state.prood_basket.length; i++){
          if(state.prood_basket[i].id == payload.params.elem.id){
            index = i;
          }
        }
        let new_elem:any = payload.params.elem;
        let new_price = new_elem.cost;
        let new_price_discount = new_elem.cost_with_discount;
        if(payload.params.amount === 1){
          new_price = new_price + new_elem._product.cost;
          new_price_discount = new_price_discount + new_elem._product.cost_with_discount;
        }else{
          new_price = new_price - new_elem._product.cost;
          new_price_discount = new_price_discount - new_elem._product.cost_with_discount;
        }
        new_elem = {...new_elem, count: Number(new_elem.count + payload.params.amount), cost: new_price, cost_with_discount: new_price_discount};
        state.prood_basket[index] = new_elem;
        state.count_basket = state.prood_basket.reduce((sum:any, current:any)=> sum+current.count, 0)
      }
    },
    [changeProodBasketAsync.rejected]: (state:any, action: any) => {
    },
  }
});

export default proodSlice.reducer;
export const { getServices } =
proodSlice.actions;
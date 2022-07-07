import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../plugins/axios/api';
import Cookies from 'js-cookie'

export const getProfileAsync:any = createAsyncThunk(
  'profile/getProfileAsync',
  async ({ nav, urlParams }:any, state:any) => { // here you have two arguments
      const response = await api('accounts/profile/info/')
      if(response.status == 401){
        nav('/auth')
      }
      else{
        return response
      }
  },
)

export const createUserProfile:any = createAsyncThunk(
  'profile/createUserProfile',
  async (params:any, action:any) => {
    const response = await api.post(`accounts/authentication/reg/`,{
      phone: params.phone,
      email: params.email,
      password: params.password,
      first_name: params.first_name,
      last_name: params.last_name,
      pin: params.pin
    })
    return response
  }
)

export const authUser:any = createAsyncThunk(
  'profile/authUser',
  async (params:any, action:any) => {
    console.log(params);
    const response = await api.post(`accounts/authentication/auth/`,{
      password: params.password,
      login:  params.phone,
    })
    console.log(response);
    
    if(response.status === 400){
      alert(response.data.detail)
    }
    else{
      return {response, nav: params.nav }
    }
  }
)

const profileSlice:any = createSlice({
  name: 'profile',
  initialState: {
    userProfile: [] as any[],
    userAuth: false as boolean,
    visiblePin: false as boolean,
    // modal window
    isProfileRegistration: false as boolean,
    isProfileAuthorisation: false as boolean, 
    // async 
    status: false as boolean,
  },
  reducers: {
    changeIsProfileRegistration(state: any) {
      state.isProfileRegistration = !state.isProfileRegistration
      state.isProfileAuthorisation = false
    },
    changeIsProfileAuthorisation(state: any){
      state.isProfileAuthorisation = !state.isProfileAuthorisation
      state.isProfileRegistration = false
    },
  },
  extraReducers: {
    [getProfileAsync.pending]: (state:any, action:any) => {
      state.status = 'loading'
    },
    [getProfileAsync.fulfilled]: (state:any, { payload }:any) => {
      console.log(payload);
      state.status = 'success'
      state.userAuth = true;
      state.userProfile = payload.data
    },
    [getProfileAsync.rejected]: (state:any, action: any) => {
      state.status = 'failed'
    },
    [createUserProfile.pending]: (state:any, action:any) => {
      state.status = 'loading'
    },
    [createUserProfile.fulfilled]: (state:any, { payload }:any) => {
      state.status = 'success'
      if(payload.status == 400){
        alert(payload.data.detail)
      }
      else{
        if(state.visiblePin){
          alert(payload.data.detail)
          state.visiblePin = !state.visiblePin
          state.isProfileRegistration = false
          state.isProfileAuthorisation = false
        }else{
          alert(payload.data.detail)
          state.visiblePin = !state.visiblePin
        }
      }
    },
    [createUserProfile.rejected]: (state:any, action: any) => {
      state.status = 'failed'
    },
    [authUser.pending]: (state:any, action:any) => {
      state.status = 'loading'
    },
    [authUser.fulfilled]: (state:any, { payload }:any) => {
      state.status = 'success'
      const myPromise = new Promise((resolve, reject) => {
        Cookies.set('token', `${payload.response.data.token}`, { path: '/', expires: 60 })
        state.userProfile = payload.response.data.user;
        state.userAuth = true;
        resolve('success')
      }).then(()=>{
        payload.nav('/')
      })
    },
    [authUser.rejected]: (state:any, action: any) => {
      state.status = 'failed'
    },
  }
})

export default profileSlice.reducer;
export const { changeIsProfileRegistration, changeIsProfileAuthorisation } =
profileSlice.actions;
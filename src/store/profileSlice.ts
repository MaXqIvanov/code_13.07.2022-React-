import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../plugins/axios/api';

export const getProfileAsync:any = createAsyncThunk(
  'profile/getProfileAsync',
  async ({ nav, urlParams }:any, state:any) => { // here you have two arguments
       api('accounts/profile/info/').then((response:any)=>{
        if(response.status == 401){
          nav('/auth')
        }
        else{
          state.userAuth = true;
        }
        return response
      })
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

const profileSlice:any = createSlice({
  name: 'profile',
  initialState: {
    userProfile: [] as any[],
    userAuth: true as boolean,
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
      state.status = 'success'
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
    }
  }
})

export default profileSlice.reducer;
export const { changeIsProfileRegistration, changeIsProfileAuthorisation } =
profileSlice.actions;
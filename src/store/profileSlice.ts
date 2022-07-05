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

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    userProfile: [] as any[],
    userAuth: true as boolean,

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
    }
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
    }
  }
})

export default profileSlice.reducer;
export const { changeIsProfileRegistration, changeIsProfileAuthorisation } =
profileSlice.actions;
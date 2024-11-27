import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: !!localStorage.getItem('accessToken'),
    user: JSON.parse(localStorage.getItem('user')) || null,
    userRole: localStorage.getItem('userRole'),
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'), 
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.userRole = action.payload.userRole;
      state.accessToken = action.payload.accessToken; 
      state.refreshToken = action.payload.refreshToken; 

      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('userRole', action.payload.user.user_type);
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      // const userrole  = localStorage.getItem('userRole');
      
    
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      
      localStorage.clear();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

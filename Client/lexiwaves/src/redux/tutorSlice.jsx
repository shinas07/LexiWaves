// import { createSlice } from '@reduxjs/toolkit';

// const tutorSlice = createSlice({
//   name: 'tutor',
//   initialState: {
//     isAuthenticated: !!localStorage.getItem('tutorAccessToken'),
//     tutor: null, // This will store tutor details like email
//     accessToken: localStorage.getItem('tutorAccessToken'),
//     refreshToken: localStorage.getItem('tutorRefreshToken'), 
//   },
//   reducers: {
//     tutorLogin: (state, action) => {
//       state.isAuthenticated = true;
//       state.tutor = action.payload.tutor; // Set the tutor data (like email)
//       state.accessToken = action.payload.accessToken; // Store the access token
//       state.refreshToken = action.payload.refreshToken; // Store the refresh token
//     },
//     tutorLogout: (state) => {
//       state.isAuthenticated = false;
//       state.tutor = null;
//       state.accessToken = null;
//       state.refreshToken = null;
      
//       // Clear tokens from localStorage when the tutor logs out
//       localStorage.removeItem('tutorAccessToken');
//       localStorage.removeItem('tutorRefreshToken');
//     },
//   },
// });

// export const { tutorLogin, tutorLogout } = tutorSlice.actions;
// export default tutorSlice.reducer;

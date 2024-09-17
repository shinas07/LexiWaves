import axios from "axios";

const api = axios.create({
    baseURL : 'http://localhost:8000', 
    withCredentials: true,

})

export default api;



// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8000',  // adjust this to your API's base URL
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = sessionStorage.getItem('access');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api;


// import axios from 'axios';

// // Create an axios instance
// const api = axios.create({
//   baseURL: 'http://localhost:8000', 
// });


// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );


// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const refreshToken = localStorage.getItem('refresh');
//         const response = await axios.post('/lexi-admin/token-refresh/', { refresh: refreshToken });
//         const { access } = response.data;
//         localStorage.setItem('access', access);
//         api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         // Handle token refresh error
//         console.error('Refresh token failed', refreshError);
//         localStorage.removeItem('access');
//         localStorage.removeItem('refresh');
//         window.location.href = '/login'; // Redirect to login
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

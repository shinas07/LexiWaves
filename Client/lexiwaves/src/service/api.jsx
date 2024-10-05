import axios from "axios";

const api = axios.create({
    baseURL : 'http://localhost:8000', 
    withCredentials: true,

})




const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await api.post('/user/refresh-token/', { refresh: refreshToken });
    localStorage.setItem('accessToken', response.data.access);
    return response.data.access;
};


// Axios interceptor to handle token expiration
api.interceptors.response.use(
    response => response,
    async (error) => {
        console.log('Interceptor triggered:', error.response.status); 
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const accessToken = await refreshAccessToken();
                
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError); 
            }
        }

        return Promise.reject(error);
    }
);




export default api;
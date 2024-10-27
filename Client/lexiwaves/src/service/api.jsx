import axios from "axios";
import { toast } from "sonner";



const api = axios.create({
    baseURL : 'http://localhost:8000', 
    withCredentials: true,

})




const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await api.post('/user/refresh-token/', { refresh: refreshToken });
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('accessTokenExpiry', Date.now() + response.data.expires_in * 1000); 
    return response.data.access;
};


// Axios interceptor to handle token expiration
api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is due to an expired access token
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const accessToken = await refreshAccessToken();
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Handle refresh token expiration
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('accessTokenExpiry');
                toast.info('Session expired. Please log in again.');
                // window.location.href = '/signin'; // Redirect to login
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);




export default api;

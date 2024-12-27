import axios from "axios";
import { store } from "../redux/Store";
import { toast } from "sonner";
import { logout } from "../redux/authSlice";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

// Utility function to check if token is expired
const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch (e) {
        return true;
    }
};

// Add token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token && !isTokenExpired(token)) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken || isTokenExpired(refreshToken)) {
        throw new Error('No valid refresh token available');
    }
    
    // Create a new axios instance for refresh requests to avoid interceptors
    const refreshApi = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        withCredentials: true,
    });
    
    try {
        const response = await refreshApi.post('/user/refresh-token/', {
            refresh: refreshToken
        });
        
        if (response.data.access) {
            localStorage.setItem('accessToken', response.data.access);
            return response.data.access;
        } else {
            throw new Error('No access token received');
        }
    } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw error;
    }
};

let refreshPromise = null;

api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // Use existing refresh promise if one is in progress
                if (!refreshPromise) {
                    refreshPromise = refreshAccessToken();
                }
                
                const newAccessToken = await refreshPromise;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                
                return api(originalRequest);
            } catch (refreshError) {
                // Clear the refresh promise
                refreshPromise = null;
                
                // Handle authentication failure
                store.dispatch(logout());
                toast.error('Session expired. Please log in again.');
                
                // Redirect to login
                if (window.location.pathname !== '/') {
                    window.location.href = '/';
                }
                
                return Promise.reject(refreshError);
            } finally {
                refreshPromise = null;
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;


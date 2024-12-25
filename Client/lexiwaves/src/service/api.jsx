import axios from "axios";
import { store } from "../redux/Store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logout } from "../redux/authSlice";
import { useDispatch } from "react-redux";


const api = axios.create({
    baseURL:  import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

// Add token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
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
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await api.post('/user/refresh-token/', { refresh: refreshToken });
    localStorage.setItem('accessToken', response.data.access);
    // Optionally store expiry time for better token management
    localStorage.setItem('accessTokenExpiry', Date.now() + response.data.expires_in * 1000);
    return response.data.access;
};

let refreshInProgress = false;

api.interceptors.response.use(
    response => response,
    async (error) => {
        if (error.response?.status === 401 && !error.config._retry && !refreshInProgress) {
            error.config._retry = true;
            refreshInProgress = true;

            try {
                const accessToken = await refreshAccessToken();
                error.config.headers['Authorization'] = `Bearer ${accessToken}`;
                return api(error.config);
            } catch (refreshError) {
                store.dispatch(logout())
                toast.info('Session expired. Please log in again.');
                window.history.pushState({}, '', '/signin');
                window.dispatchEvent(new PopStateEvent('popstate'));
                return Promise.reject(refreshError);
            } finally {
                refreshInProgress = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;

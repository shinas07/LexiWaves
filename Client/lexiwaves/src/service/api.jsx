import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logout } from "../redux/authSlice";
import { useDispatch } from "react-redux";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
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
        // We can’t use React hooks like `useNavigate` or `useDispatch` here, so we’ll use them outside the interceptor
        if (error.response.status === 401 && !error.config._retry && !refreshInProgress) {
            error.config._retry = true; // Prevent infinite retry loop

             // Prevent infinite refresh loop
             refreshInProgress = true;

            try {
                const accessToken = await refreshAccessToken();
                error.config.headers['Authorization'] = `Bearer ${accessToken}`;
                return api(error.config); // Retry the original request
            } catch (refreshError) {
                // Handle the failure to refresh the token
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                toast.info('Session expired. Please log in again.');

                // Redirect to login (from a component using navigate or history)
                window.location.href = "/"; // This can be replaced with React's `navigate("/signin")` if you handle routing better.

                // Dispatch logout action
                const dispatch = useDispatch(); // Make sure this is used in a React component
                dispatch(logout());

                return Promise.reject(refreshError); // Reject the refresh error
            }finally{
                
                refreshInProgress = false
            }
        }

        return Promise.reject(error); // Handle other errors
    }
);

export default api;

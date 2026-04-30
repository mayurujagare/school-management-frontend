import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ── Helper: Force logout and redirect ─────────────────────
const forceLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    // Use replace so user can't go back to expired session
    if (window.location.pathname !== '/login' && window.location.pathname !== '/parent-login') {
        window.location.replace('/login');
    }
};

// ── Track if a refresh is currently in progress ───────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

// ── Request interceptor — attach JWT ──────────────────────
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor — handle 401 + refresh ───────────
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip refresh for the refresh endpoint itself (avoid infinite loop)
        if (originalRequest.url?.includes('/auth/refresh')) {
            forceLogout();
            return Promise.reject(error);
        }

        // Skip refresh for login endpoints
        if (
            originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/otp')
        ) {
            return Promise.reject(error);
        }

        // Handle 401 — token expired
        if (error.response?.status === 401 && !originalRequest._retry) {

            // If a refresh is already in progress, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                isRefreshing = false;
                forceLogout();
                return Promise.reject(error);
            }

            try {
                // Use a NEW axios instance to avoid interceptor recursion
                const refreshResponse = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    { refreshToken },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
                    refreshResponse.data.data;

                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                // Process all queued requests with the new token
                processQueue(null, newAccessToken);

                // Retry the original request
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                // Refresh failed — refresh token is also expired/invalid
                processQueue(refreshError, null);
                forceLogout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // 403 — forbidden, but token is valid (just no permission)
        if (error.response?.status === 403) {
            // Don't logout, just reject
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default api;
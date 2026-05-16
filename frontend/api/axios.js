// src/api/axios.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;
// const baseURL = "http://localhost:3000"

const axiosInstance = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json', // Default content type
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If the request contains FormData (e.g., file upload), remove the default JSON content type
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (expired/invalid session) — not failed login/register
    const requestUrl = originalRequest?.url || '';
    const isAuthRequest =
      requestUrl.includes('/login') || requestUrl.includes('/register');
    const isOnLoginPage = window.location.pathname === '/login';

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest &&
      !isOnLoginPage
    ) {
      originalRequest._retry = true;
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
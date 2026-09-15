import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8000/api/v1';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach bearer token from localStorage / Redux Persist state
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    let token: string | null = localStorage.getItem('token');

    if (!token) {
      try {
        const persistAuth = localStorage.getItem('persist:auth');
        if (persistAuth) {
          const parsedAuth = JSON.parse(persistAuth);
          if (parsedAuth.token) {
            token = JSON.parse(parsedAuth.token);
          }
        }
      } catch (error) {
        console.error('Error al recuperar token de persist:auth', error);
      }
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn('Sesión expirada o no autorizada (401).');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  refreshAccessToken,
  logoutUser,
} from '../../features/auth/api/authApi';

const API_SERVER = import.meta.env.VITE_API_SERVER;

/**
 * Interface for extended request configuration, adding a _retry field,
 * to track retry attempts
 */
interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: API_SERVER,
});

/**
 * Interceptor to add the authorization token to the headers of all outgoing requests.
 * If the token exists in localStorage, it is added to the Authorization header.
 * @param {InternalAxiosRequestConfig} config - Request configuration.
 * @returns {InternalAxiosRequestConfig} - Updated request configuration.
 */
api.interceptors.request.use(
  (config: AxiosRequestConfigWithRetry): AxiosRequestConfigWithRetry => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

/**
 * Interceptor to handle response errors.
 * In case of a 401 error, an attempt is made to refresh the token.
 * If token refresh fails, the user is logged out.
 * @param {AxiosResponse} response - Response from the server.
 * @param {AxiosError} error - Request error.
 * @returns {Promise<AxiosResponse | any>} - Returns the response or error.
 */
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<AxiosResponse | void> => {
    const originalRequest: AxiosRequestConfigWithRetry =
      error.config as AxiosRequestConfigWithRetry;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // If the error is 401 (unauthorized), attempt to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Error during token refresh:', refreshError);
        logoutUser();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

/**
 * API Base URL - Change this to your actual API base URL
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * Function to get the a   uthentication token from cookies
 */
const getServerToken = (): string | undefined => {
  return Cookies.get("token");
};

/**
 * Axios Instance with Base Configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor - Attaches Token from Cookies
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getServerToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor - Handles API Errors
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse): any => {
    return response ?? Promise.reject(response.status);
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      console.error(`API Error [${status}]:`, data?.message || "Unknown error");

      if (status === 401 || status === 403) {
        window.location.href = "/admin";
        console.warn("Unauthorized! Redirect to login...");
      } else if (status >= 500) {
        console.warn("Server error! Try again later.");
      }
    } else {
      console.error("Network error! Please check your connection.");
    }
    return Promise.reject(error);
  }
);

/**
 * Type Definitions for API Methods
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

const RestAPI = {
  get: <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    console.log(url);
    return apiClient.get(url, config);
  },

  post: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => apiClient.post(url, data, config),

  put: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => apiClient.put(url, data, config),

  delete: <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => apiClient.delete(url, config),
};

export default RestAPI;

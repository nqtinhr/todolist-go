import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";

interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosRequestHeaders;
}

export const axiosInstance = axios.create({
  baseURL: `/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptors
axiosInstance.interceptors.request.use(
  (config): AdaptAxiosRequestConfig => {
    return config;
  },
  (error): any => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  async (response): Promise<any> => {
    if (response && response.data) {
      return response.data;
    }
  },
  async (error): Promise<any> => {
    return Promise.reject(error);
  }
);

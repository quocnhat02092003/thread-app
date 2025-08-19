import axios, { AxiosInstance } from "axios";

const API: AxiosInstance = axios.create({baseURL: process.env.REACT_APP_API_URL, withCredentials: true});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/refresh-token`, {}, { withCredentials: true })
        return API(originalRequest); // Retry request
      } catch (refreshError) {
        console.error("Refresh token failed");
      }
    }

    return Promise.reject(error);
  }
);

export default API;

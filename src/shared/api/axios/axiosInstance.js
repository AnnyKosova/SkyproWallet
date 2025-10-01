import axios from 'axios';
import { getAuthUserToken } from '../local-storage';

const apiUrl = import.meta.env.VITE_URL || '';

export const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": " ",
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthUserToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    //plug: before adding react-hot-toast
    console.log(error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    //plug: before adding react-hot-toast
    console.log(error);
    return Promise.reject(error);
  }
);

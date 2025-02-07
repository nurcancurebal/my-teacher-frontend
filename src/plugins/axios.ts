import { useNavigate } from "react-router-dom";

import axios, { AxiosError } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL as string;

const instance = axios.create({
  baseURL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      if (error.response.status === 401) {
        const navigate = useNavigate();
        navigate("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default instance;

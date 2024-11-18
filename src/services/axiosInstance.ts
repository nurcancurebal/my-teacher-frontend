import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const baseURL = process.env.REACT_APP_BASE_URL;

const instance = axios.create({
  baseURL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

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
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        const navigate = useNavigate();
        if (window.location.pathname !== "/") {
          navigate("/");
        }
      }
    }
    return Promise.reject(error);
  }
);

export default instance;

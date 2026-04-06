import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

if (!import.meta.env.VITE_API_URL) {
  throw new Error("VITE_API_URL não definida");
}

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
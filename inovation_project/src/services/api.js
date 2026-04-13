import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
 
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
 
    config.headers.Authorization = `Bearer ${token.trim()}`;
  } else {
    console.warn("Requisição enviada sem Token! O erro 401 é esperado.");
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
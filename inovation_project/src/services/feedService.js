import api from "./api.js";
export const getFeed = (page = 1) => api.get(`/feed?page=${page}&limit=10`);
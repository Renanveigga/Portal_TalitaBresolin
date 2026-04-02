import api from "./api.js";

export const getTalent = (filtros = {}) => {
  const params = new URLSearchParams(filtros).toString();
  return api.get(`/talentos${params ? `?${params}` : ""}`);
};
export const getTalentosAdmin = () => api.get("/talentos/admin");
export const createTalento    = (formData) =>
  api.post("/talentos", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateStatus  = (id, status) => api.put(`/talentos/${id}`, { status });
export const deleteTalento = (id) => api.delete(`/talentos/${id}`);
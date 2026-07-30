import api from "./api.js";

export const getAchados = () => api.get("/achados");

export const createAchado = (formData) =>
  api.post("/achados", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateAchado = (id, dados) =>
  api.put(`/achados/${id}`, dados);

export const deleteAchado = (id) =>
  api.delete(`/achados/${id}`);
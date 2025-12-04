import client from "./client";

export const getPerfumes = () => client.get("perfumes/");
export const createPerfume = (data) => client.post("perfumes/", data);
export const updatePerfume = (id, data) => client.put(`perfumes/${id}/`, data);
export const deletePerfume = (id) => client.delete(`perfumes/${id}/`);

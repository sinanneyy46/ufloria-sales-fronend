import client from "./client";

export const getOrders = () => client.get("orders/");
export const createOrder = (data) => client.post("orders/", data);
export const updateOrder = (id, data) => client.put(`orders/${id}/`, data);
export const deleteOrder = (id) => client.delete(`orders/${id}/`);

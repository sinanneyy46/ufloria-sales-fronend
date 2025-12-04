import client from "./client";

export const getTemplate = () => client.get("template/1/");
export const updateTemplate = (data) => client.put("template/1/", data);

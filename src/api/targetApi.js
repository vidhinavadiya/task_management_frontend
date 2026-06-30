import API from "./axios";

export const targetApi = {
    create: (data) => API.post("/targets", data),
    getAll: () => API.get("/targets"),
};
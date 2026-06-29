import API from "./axios";

export const taskApi = {
    getAll: (params) => API.get("/tasks", { params }),

    create: (data) => API.post("/tasks", data),

    update: (id, data) => API.put(`/tasks/${id}`, data),

    delete: (id) => API.delete(`/tasks/${id}`),
};
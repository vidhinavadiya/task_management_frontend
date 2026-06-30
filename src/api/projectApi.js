import API from "./axios";

export const projectApi = {
    getAll: (params) => API.get("/projects", { params }),

    getById: (id) => API.get(`/projects/${id}`),

    create: (data) => API.post("/projects", data),

    update: (id, data) => API.put(`/projects/${id}`, data),

    delete: (id) => API.delete(`/projects/${id}`),

    updateStatus: (id, status) =>
        API.patch(`/projects/${id}/status`, { status }),
};
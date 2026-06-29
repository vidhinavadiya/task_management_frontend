import API from "./axios";   // ← Use the main axios with token interceptor

export const transactionApi = {
    getAll: (params) => API.get("/transactions", { params }),
    create: (data) => API.post("/transactions", data),
    update: (id, data) => API.put(`/transactions/${id}`, data),
    delete: (id) => API.delete(`/transactions/${id}`),
};
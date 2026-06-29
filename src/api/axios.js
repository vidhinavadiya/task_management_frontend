import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("adminToken");  // Must be adminToken

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("No adminToken found in localStorage");
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default API;
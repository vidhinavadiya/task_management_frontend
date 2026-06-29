import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,   // Backend URL
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const loginAdmin = async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
};

export default API;
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',   // Backend URL
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
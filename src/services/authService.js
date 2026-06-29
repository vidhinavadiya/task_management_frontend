import { loginAdmin } from '../api/authApi';

class AuthService {

   async login(credentials) {
    try {
        const data = await loginAdmin(credentials);

        if (data.success && data.data?.token) {
            const token = data.data.token;
            const admin = data.data.admin || data.data.data?.admin;

            localStorage.setItem('adminToken', token);
            localStorage.setItem('adminData', JSON.stringify(admin));

            console.log("✅ Token saved successfully:", token); // Debug
            return data;
        }
    } catch (error) {
        console.error("Login Error:", error);
        throw error.response?.data?.message || error.message || "Login failed";
    }
}

    logout() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
    }
}

export default new AuthService();
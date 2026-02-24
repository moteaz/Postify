import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    withCredentials: true,
});

// Interceptor to add Bearer token
api.interceptors.request.use((config) => {
    try {
        const authData = localStorage.getItem("postify-auth-storage");
        if (authData) {
            const { state } = JSON.parse(authData);
            if (state?.token) {
                config.headers.Authorization = `Bearer ${state.token}`;
            }
        }
    } catch (error) {
        console.error("Error setting auth header:", error);
    }
    return config;
});

export default api;

import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// Menyisipkan token admin (kalau ada) ke setiap request.
// Endpoint publik (GET projects) tidak terganggu — backend cuma
// memvalidasi token di endpoint yang memang butuh auth.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Kalau backend menolak token (401) — misal sudah expired — bersihkan
// token lama dan lempar admin balik ke halaman login. Dikecualikan untuk
// request login itu sendiri, supaya salah password tidak memicu redirect loop.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginRequest = error.config?.url?.includes("/auth/login");
        const onAdminRoute = window.location.pathname.startsWith("/admin");
        const onLoginPage = window.location.pathname === "/admin/login";

        if (error.response?.status === 401 && !isLoginRequest) {
            localStorage.removeItem("adminToken");
            if (onAdminRoute && !onLoginPage) {
                window.location.href = "/admin/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
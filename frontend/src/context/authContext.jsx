import { createContext, useContext, useEffect, useState } from "react";
import { login as loginRequest, getMe } from "@/services/authService";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    // loading -> authenticated -> dashboard bisa diakses
    // loading -> unauthenticated -> redirect ke /admin/login
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        const token = localStorage.getItem("adminToken")

        if (!token) {
            setStatus("unauthenticated");
            return;
        }

        // Token ada di localStorage, tapi belum tentu masih valid
        // (bisa saja sudah expired) — makanya perlu dicek ke /auth/me
        getMe()
            .then((data) => {
                setAdmin(data);
                setStatus("authenticated");
            })
            .catch(() => {
                localStorage.removeItem("adminToken");
                setStatus("unauthenticated");
            });
    }, []);

    async function login(email, password) {
        const { token, admin: adminData } = await loginRequest(email, password);
        localStorage.setItem("adminToken", token);
        setAdmin(adminData);
        setStatus("authenticated");
    }

    function logout() {
        localStorage.removeItem("adminToken");
        setAdmin(null);
        setStatus("unauthenticated");
    }

    return (
        <AuthContext.Provider value={{ admin, status, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth harus dipakai di dalam AuthProvider");
    }
    return ctx;
}
import { useAuth } from "@/context/authContext";
import { Navigate } from "react-router-dom";

export default function protectedRoute({ children }) {
    const { status } = useAuth();

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-ink">
                <p className="font-mono text-sm text-text-muted">Memeriksa sesi...</p>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}

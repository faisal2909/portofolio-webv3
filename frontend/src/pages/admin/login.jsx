import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            navigate("/admin/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login gagal, coba lagi.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-ink px-6">
            <div className="w-full max-w-sm">
                <p className="mb-2 font-mono text-xs text-amber">admin · login</p>
                <h1 className="mb-8 font-display text-2xl font-semibold text-text">
                    Masuk ke Dashboard
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block font-mono text-xs text-text-muted"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="username"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-colors focus:border-teal"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1 block font-mono text-xs text-text-muted"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-colors focus:border-teal"
                        />
                    </div>

                    {error && (
                        <p className="rounded-lg border border-amber/40 bg-amber/10 px-3 py-2 text-xs text-amber">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full bg-amber px-6 py-3 font-mono text-sm font-medium text-ink transition-colors hover:bg-amber/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Memproses..." : "Masuk"}
                    </button>
                </form>
            </div>
        </div>
    );
}
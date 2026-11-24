import { Link } from "react-router-dom";

export default function adminHeader({ title, backTo = "/admin/dashboard" }) {
    return (
        <div className="mb-8">
            <Link
                to={backTo}
                className="mb-4 inline-flex items-center gap-2 font-mono text-xs text-text-muted transition-colors hover:text-teal"
            >
                ← Kembali ke dashboard
            </Link>
            <p className="font-mono text-xs text-amber">admin</p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-text">{title}</h1>
        </div>
    );
}
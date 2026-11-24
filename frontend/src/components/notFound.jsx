import { Link } from "react-router-dom";

export default function notFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
            <p className="font-mono text-xs text-amber">404</p>
            <h1 className="mt-2 font-display text-2xl font-semibold text-text">
                Halaman tidak ditemukan
            </h1>
            <p className="mt-2 max-w-sm text-sm text-text-muted">
                URL yang kamu tuju mungkin salah ketik, atau halamannya sudah tidak ada.
            </p>
            <Link
                to="/"
                className="mt-8 rounded-full bg-amber px-6 py-3 font-mono text-sm font-medium text-ink transition-colors hover:bg-amber/90"
            >
                Kembali ke beranda
            </Link>
        </div>
    );
}
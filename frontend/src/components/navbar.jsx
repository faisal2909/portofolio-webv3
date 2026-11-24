import { Link } from "react-router-dom";
import { useLanguage } from "@/context/languageContext";

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;

export default function Navbar() {
    const { lang, toggleLang, t } = useLanguage();

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-ink/80 backdrop-blur-sm">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
                <Link
                    to="/"
                    className="flex items-center gap-2 font-mono text-sm text-text"
                >
                    faisal.dev
                    <span className="hidden rounded-full border border-border px-2 py-0.5 text-xs text-text-muted sm:inline-block">
                        v3.0.0
                    </span>
                </Link>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={toggleLang}
                        aria-label="Toggle language"
                        className="flex items-center gap-1 rounded-full border border-border p-0.5 font-mono text-xs"
                    >
                        <span
                            className={`rounded-full px-2 py-1 transition-colors ${lang === "en" ? "bg-surface-hover text-teal" : "text-text-muted"
                                }`}
                        >
                            EN
                        </span>
                        <span
                            className={`rounded-full px-2 py-1 transition-colors ${lang === "id" ? "bg-surface-hover text-teal" : "text-text-muted"
                                }`}
                        >
                            ID
                        </span>
                    </button>

                    <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contactEmail}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-border px-3 py-2 font-mono text-xs text-text-muted transition-colors hover:border-teal hover:text-teal sm:px-4"
                    >
                        {t.nav.contact}
                    </a>
                </div>
            </div>
        </header>
    );
}

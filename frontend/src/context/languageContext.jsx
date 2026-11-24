import { useEffect, useState, createContext, useContext } from "react";
import { translations } from "@/i18n/translations";

const languageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

    useEffect(() => {
        localStorage.setItem("lang", lang);
        document.documentElement.lang = lang;
    }, [lang]);

    const toggleLang = () => setLang((prev) => (prev === "en" ? "id" : "en"));

    const value = { lang, toggleLang, t: translations[lang] };

    return (
        <languageContext.Provider value={value}>
            {children}
        </languageContext.Provider>
    )
}

export function useLanguage() {
    const ctx = useContext(languageContext);
    if (!ctx) {
        throw new Error("useLanguage harus dipakai di dala LanguageProvider");
    }
    return ctx;
}
import { motion } from "framer-motion"
import { useLanguage } from "@/context/languageContext"

const container = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
};

const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Hero() {
    const { t } = useLanguage();

    return (
        <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-24">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative mx-auto max-w-3xl"
            >
                <motion.h1
                    variants={item}
                    className="font-display text-4xl font-semibold leading-tight text-text sm:text-5xl md:text-6xl"
                >
                    Muhammad Faisal Hakim
                </motion.h1>

                <motion.p
                    variants={item}
                    className="mt-6 max-w-xl text-lg leading-relaxed text-text-muted"
                >
                    {t.hero.subhead}
                </motion.p>

                <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
                    <a
                        href="#projects"
                        className="rounded-full bg-amber px-6 py-3 font-mono text-sm font-medium text-ink transition-colors hover:bg-amber/90"
                    >
                        {t.hero.ctaPrimary}
                    </a>
                    <a
                        href="/cv.pdf"
                        className="rounded-full border border-border px-6 py-3 font-mono text-sm text-text transition-colors hover:border-teal hover:text-teal"
                    >
                        {t.hero.ctaSecondary}
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
}
import { useLanguage } from "@/context/languageContext"
import { motion } from "framer-motion";

const techStack = [
    { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
    { name: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
    { name: "Express", icon: "https://cdn.simpleicons.org/express/FFFFFF" },
    { name: "Git", icon: "https://cdn.simpleicons.org/git/F05032" },
    { name: "GitHub", icon: "https://cdn.simpleicons.org/github/FFFFFF" },
    { name: "PostgreSql", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
    { name: "MySQL", icon: "https://cdn.simpleicons.org/mysql/4479A1" },
    { name: "Prisma", icon: "https://cdn.simpleicons.org/prisma/2D3748" },
]

const container = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.06 },
    },
}

const item = {
    hidden: { opacity: 0, y: 12 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: "easeOut" },
    },
}

export default function Techstack() {
    const { t } = useLanguage();

    return (
        <section className="px-24 py-24">
            <div div className="mx-auto max-w-5xl" >
                <div className="mb-10 max-w-2xl">
                    <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">{t.techStack.subheading}</h2>
                    <p className="mt-4 text-text-muted">{t.techStack.description}</p>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5"
            >
                {techStack.map((tech) => (
                    <motion.div
                        key={tech.name}
                        variants={item}
                        className="group flex min-h-28 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface px-4 py-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-teal/50 hover:bg-surface-hover"
                    >
                        <div className="flex h-10 w-10 items-center justify-center">
                            <img
                                src={tech.icon}
                                alt=""
                                aria-hidden="true"
                                loading="lazy"
                                className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>
                        <span className="font-mono text-xs text-text sm:text-sm">
                            {tech.name}
                        </span>
                    </motion.div>
                ))}
            </motion.div>

        </section>
    )
}
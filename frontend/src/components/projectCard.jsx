import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { parseTechStack, formatYear } from "@/utils/project"

export default function ProjectCard({ project, t }) {
    const tags = parseTechStack(project.techStack);
    const year = formatYear(project.createdAt);

    return (
        <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-teal/60"
        >
            <Link to={`/project/${project.id}`} className="flex flex-1 flex-col">
                <div className="aspect-video w-full overflow-hidden bg-ink">
                    {project.imageUrl ? (
                        <img
                            src={project.imageUrl}
                            alt={project.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div
                            aria-hidden="true"
                            className="flex h-full w-full items-center justify-center"
                            style={{
                                backgroundImage:
                                    "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
                                backgroundSize: "20px 20px",
                            }}
                        >
                            <span className="font-mono text-xs text-text-muted">
                                {project.title.slice(0, 2).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex flex-1 flex-col p-6 pb-4">
                    <p className="mb-3 inline-flex w-fit items-center gap-1.5 font-mono text-xs text-amber">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                        {t.shipped} · {project.category || t.defaultCategory}
                        {year ? ` · ${year}` : ""}
                    </p>

                    <h3 className="font-display text-lg font-semibold text-text transition-colors group-hover:text-teal">
                        {project.title}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-muted">
                        {project.description}
                    </p>

                    {tags.length > 0 && (
                        <ul className="mt-4 flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <li
                                    key={tag}
                                    className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-text-muted"
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Link>

            {(project.demoUrl || project.repoUrl) && (
                <div className="flex gap-4 border-t border-border px-6 py-4 font-mono text-xs">
                    {project.demoUrl && (
                        <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal transition-opacity hover:opacity-80"
                        >
                            {t.demo} →
                        </a>
                    )}
                    {project.repoUrl && (
                        <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-muted transition-colors hover:text-teal"
                        >
                            {t.code} →
                        </a>
                    )}
                </div>
            )}
        </motion.article>
    );
}
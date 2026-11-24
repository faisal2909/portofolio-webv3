import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getProjectById } from "@/services/projectService";
import { useLanguage } from "@/context/languageContext";
import Navbar from "@/components/navbar";
import { parseTechStack, formatYear } from "@/utils/project";

export default function projectDetail() {
    const { id } = useParams();
    const { t } = useLanguage();
    const [project, setProject] = useState(null);
    const [status, setStatus] = useState("loading"); // loading | success | notfound | error

    useEffect(() => {
        let cancelled = false;
        setStatus("loading");

        async function fetchProject() {
            try {
                const data = await getProjectById(id);
                if (!cancelled) {
                    setProject(data);
                    setStatus("success");
                }
            } catch (err) {
                if (cancelled) return;
                setStatus(err.response?.status === 404 ? "notfound" : "error");
            }
        }

        fetchProject();
        return () => {
            cancelled = true;
        };
    }, [id]);

    const tags = project ? parseTechStack(project.techStack) : [];
    const year = project ? formatYear(project.createdAt) : "";
    const dt = t.projectDetail;

    return (
        <>
            <Navbar />
            <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
                <Link
                    to="/"
                    className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-text-muted transition-colors hover:text-teal"
                >
                    ← {dt.back}
                </Link>

                {status === "loading" && (
                    <div className="space-y-4">
                        <div className="h-8 w-2/3 animate-pulse rounded bg-surface" />
                        <div className="aspect-video w-full animate-pulse rounded-2xl bg-surface" />
                    </div>
                )}

                {status === "notfound" && (
                    <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                        <p className="font-mono text-sm text-text">{dt.notFoundTitle}</p>
                        <p className="mt-2 text-sm text-text-muted">{dt.notFoundBody}</p>
                    </div>
                )}

                {status === "error" && (
                    <div className="rounded-2xl border border-border bg-surface p-8 text-center">
                        <p className="font-mono text-sm text-text">{dt.errorTitle}</p>
                        <p className="mt-2 text-sm text-text-muted">{dt.errorBody}</p>
                    </div>
                )}

                {status === "success" && project && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <p className="mb-4 inline-flex items-center gap-1.5 font-mono text-xs text-amber">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                            {dt.shipped} · {project.category || dt.defaultCategory}
                            {year ? ` · ${year}` : ""}
                        </p>

                        <h1 className="font-display text-3xl font-semibold text-text sm:text-4xl">
                            {project.title}
                        </h1>

                        <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-ink">
                            {project.imageUrl ? (
                                <img
                                    src={project.imageUrl}
                                    alt={project.title}
                                    className="h-full w-full object-cover"
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

                        <p className="mt-8 whitespace-pre-line text-base leading-relaxed text-text-muted">
                            {project.description}
                        </p>

                        {tags.length > 0 && (
                            <ul className="mt-6 flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <li
                                        key={tag}
                                        className="rounded-full border border-border px-3 py-1 font-mono text-xs text-text-muted"
                                    >
                                        {tag}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="mt-10 flex flex-wrap gap-4">
                            {project.demoUrl && (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full bg-amber px-6 py-3 font-mono text-sm font-medium text-ink transition-colors hover:bg-amber/90"
                                >
                                    {dt.viewDemo}
                                </a>
                            )}
                            {project.repoUrl && (
                                <a
                                    href={project.repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full border border-border px-6 py-3 font-mono text-sm text-text transition-colors hover:border-teal hover:text-teal"
                                >
                                    {dt.viewCode}
                                </a>
                            )}
                        </div>
                    </motion.div>
                )}
            </main>
        </>
    );
}
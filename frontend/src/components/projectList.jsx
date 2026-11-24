import { useEffect, useState } from "react";
import { useLanguage } from "@/context/languageContext";
import { getProjects } from "@/services/projectService";
import ProjectCard from "@/components/projectCard";

export default function projectList() {
    const { t } = useLanguage();
    const [projects, setProjects] = useState();
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        let cancelled = false;

        async function fetchProjects() {
            try {
                const data = await getProjects();
                if (!cancelled) {
                    setProjects(data);
                    setStatus("success");
                }
            } catch {
                if (!cancelled) setStatus("error");
            }
        }

        fetchProjects();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <section id="projects" className="mx-auto max-w-5xl px-6 py-24">

            {status === "loading" && (
                <div className="grid gap-6 sm:grid-cols-2">
                    {[0, 1].map((i) => (
                        <div
                            key={i}
                            className="h-72 animate-pulse rounded-2xl border border-border bg-surface"
                        />
                    ))}
                </div>
            )}

            {status === "error" && (
                <div className="rounded-2xl border border-border bg-surface p-8 text-center">
                    <p className="font-mono text-sm text-text">{t.projects.errorTitle}</p>
                    <p className="mt-2 text-sm text-text-muted">{t.projects.errorBody}</p>
                </div>
            )}

            {status === "success" && projects.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                    <p className="font-mono text-sm text-text">{t.projects.emptyTitle}</p>
                    <p className="mt-2 text-sm text-text-muted">{t.projects.emptyBody}</p>
                </div>
            )}

            {status === "success" && projects.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} t={t.projects.card} />
                    ))}
                </div>
            )}
        </section>
    );
}
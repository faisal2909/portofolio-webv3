import { parseTechStack } from "@/utils/project";

export default function projectPreviewCard({ values }) {
    const tags = parseTechStack(values.techStack);
    const year = new Date().getFullYear();

    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="aspect-video w-full overflow-hidden bg-ink">
                {values.imageUrl ? (
                    <img
                        src={values.imageUrl}
                        alt={values.title || "Preview"}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <div
                        aria-hidden="true"
                        className="flex h-full w-full items-center justify-center"
                    >
                        <span className="font-mono text-xs text-text-muted">
                            {(values.title || "??").slice(0, 2).toUpperCase()}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6">
                <p className="mb-3 inline-flex w-fit items-center gap-1.5 font-mono text-xs text-amber">
                    shipped · {values.category || "Project"} · {year}
                </p>

                <h3 className="font-display text-lg font-semibold text-text">
                    {values.title || "Judul project"}
                </h3>

                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-muted">
                    {values.description || "Deskripsi project akan muncul di sini..."}
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
        </div>
    );
}
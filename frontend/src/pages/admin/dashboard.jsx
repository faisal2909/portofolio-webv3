import { useAuth } from "@/context/authContext";
import { getProjects } from "@/services/projectService";
import { parseTechStack } from "@/utils/project";
import ConfirmDialog from "@/components/confirmDialog";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Dashboard() {
    const { admin, logout } = useAuth();
    const [projects, setProjects] = useState([])
    const [status, setStatus] = useState("loading");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [toast, setToast] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    async function loadProjects() {
        setStatus("loading");

        try {
            const data = await getProjects();
            setProjects(data);
            setStatus("success");
        } catch {
            setStatus("error");
        }
    }

    useEffect(() => {
        loadProjects();
    }, []);

    // Toast dikirim lewat location.state setelah redirect dari halaman
    // Tambah/Edit — begitu terbaca, langsung dibersihkan supaya tidak
    // muncul lagi kalau halaman ini di-refresh atau diakses via tombol back.
    useEffect(() => {
        if (location.state?.toast) {
            setToast(location.state.toast);
            navigate(location.pathname, { replace: true, state: {} });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(timer);
    }, [toast]);

    async function handleDeleteConfirm() {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteProject(deleteTarget.id);
            setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
            setToast({ type: "success", message: `"${deleteTarget.title}" berhasil dihapus.` });
        } catch (err) {
            setToast({
                type: "error",
                message: err.response?.data?.message || "Gagal menghapus project.",
            });
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    }

    return (
        <div className="min-h-screen bg-ink px-6 py-10">
            <div className="mx-auto max-w-5xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="font-mono text-xs text-amber">admin · dashboard</p>
                        <p className="mt-1 font-mono text-sm text-text">Halo, {admin?.username || "Admin"}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/admin/projects/new"
                            className="rounded-full bg-amber px-4 py-2 font-mono text-xs font-medium text-ink transition-colors hover:bg-amber/90"
                        >
                            + Tambah Project
                        </Link>
                        <button
                            onClick={logout}
                            className="rounded-full border border-border px-4 py-2 font-mono text-xs text-text-muted transition-colors hover:border-amber hover:text-amber"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="mt-10">
                    {status === "loading" && (
                        <div className="space-y-3">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="h-16 animate-pulse rounded-xl border border-border bg-surface"
                                />
                            ))}
                        </div>
                    )}

                    {status === "error" && (
                        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
                            <p className="font-mono text-sm text-text">Gagal memuat data project</p>
                            <p className="mt-2 text-sm text-text-muted">Coba muat ulang halaman.</p>
                        </div>
                    )}

                    {status === "success" && projects.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                            <p className="font-mono text-sm text-text">Belum ada project</p>
                            <p className="mt-2 text-sm text-text-muted">
                                Klik &quot;+ Tambah Project&quot; untuk mulai mengisi portofolio kamu.
                            </p>
                        </div>
                    )}

                    {status === "success" && projects.length > 0 && (
                        <div className="overflow-x-auto rounded-2xl border border-border">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-surface font-mono text-xs uppercase tracking-wider text-text-muted">
                                        <th className="px-4 py-3">Project</th>
                                        <th className="hidden px-4 py-3 sm:table-cell">Tech Stack</th>
                                        <th className="hidden px-4 py-3 md:table-cell">Kategori</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map((project) => {
                                        const tags = parseTechStack(project.techStack);
                                        return (
                                            <tr
                                                key={project.id}
                                                className="border-b border-border last:border-0 hover:bg-surface-hover"
                                            >
                                                <td className="px-4 py-3 text-text">{project.title}</td>
                                                <td className="hidden px-4 py-3 text-text-muted sm:table-cell">
                                                    {tags.slice(0, 3).join(", ")}
                                                    {tags.length > 3 ? "…" : ""}
                                                </td>
                                                <td className="hidden px-4 py-3 text-text-muted md:table-cell">
                                                    {project.category || "—"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end gap-1 font-mono text-xs">
                                                        <Link
                                                            to={`/admin/projects/${project.id}/edit`}
                                                            className="rounded-md px-2 py-1.5 text-teal transition-colors hover:bg-surface-hover"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => setDeleteTarget(project)}
                                                            className="rounded-md px-2 py-1.5 text-amber transition-colors hover:bg-surface-hover"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>


            <ConfirmDialog
                open={Boolean(deleteTarget)}
                title="Hapus project ini?"
                description={deleteTarget ?
                    `"${deleteTarget.title}" akan dihapus permanen dan tidak lagi muncul di public site.`
                    :
                    ""
                }
                confirmLabel="Hapus"
                loading={deleting}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
            />

            {toast && (
                <div
                    className={`fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full border px-4 py-2 font-mono text-xs shadow-lg ${toast.type === "success" ?
                        "border-teal/40 bg-surface text-teal"
                        :
                        "border-amber/40 bg-surface text-amber"
                        }`}
                >
                    {toast.message}
                </div>
            )}

        </div>
    )
}
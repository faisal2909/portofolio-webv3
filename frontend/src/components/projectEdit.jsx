import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectById, updateProject } from "@/services/projectService";
import ProjectForm from "@/components/projectForm";
import AdminHeader from "@/components/admin/adminHeader";

export default function ProjectEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState(null);
    const [status, setStatus] = useState("loading"); // loading | success | error

    useEffect(() => {
        let cancelled = false;

        getProjectById(id)
            .then((data) => {
                if (!cancelled) {
                    setInitialValues(data);
                    setStatus("success");
                }
            })
            .catch(() => {
                if (!cancelled) setStatus("error");
            });

        return () => {
            cancelled = true;
        };
    }, [id]);

    async function handleSubmit(values) {
        await updateProject(id, values);
        navigate("/admin/dashboard", {
            state: {
                toast: { type: "success", message: `"${values.title}" berhasil diperbarui.` },
            },
        });
    }

    return (
        <div className="min-h-screen bg-ink px-6 py-10">
            <div className="mx-auto max-w-5xl">
                <AdminHeader title="Edit Project" />

                {status === "loading" && (
                    <p className="font-mono text-xs text-text-muted">Memuat data project...</p>
                )}

                {status === "error" && (
                    <div className="rounded-2xl border border-border bg-surface p-8 text-center">
                        <p className="font-mono text-sm text-text">Gagal memuat project</p>
                        <p className="mt-2 text-sm text-text-muted">
                            Project mungkin sudah dihapus, atau ada masalah koneksi.
                        </p>
                    </div>
                )}

                {status === "success" && initialValues && (
                    <ProjectForm
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        submitLabel="Simpan Perubahan"
                    />
                )}
            </div>
        </div>
    );
}
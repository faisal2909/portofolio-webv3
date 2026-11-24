import { useNavigate } from "react-router-dom";
import { createProject } from "@/services/projectService";
import ProjectForm from "@/components/projectForm";
import AdminHeader from "@/components/admin/adminHeader";

export default function ProjectNew() {
    const navigate = useNavigate();

    async function handleSubmit(values) {
        await createProject(values);
        navigate("/admin/dashboard", {
            state: {
                toast: { type: "success", message: `"${values.title}" berhasil ditambahkan.` },
            },
        });
    }

    return (
        <div className="min-h-screen bg-ink px-6 py-10">
            <div className="mx-auto max-w-5xl">
                <AdminHeader title="Tambah Project" />
                <ProjectForm onSubmit={handleSubmit} submitLabel="Simpan Project" />
            </div>
        </div>
    );
}
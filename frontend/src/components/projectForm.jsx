import { useEffect, useState } from "react";
import { validateProjectForm } from "@/utils/validateProjectForm";
import { uploadProjectImage } from "@/services/uploadService";
import ProjectPreviewCard from "@/components/projectPreviewCard";

const emptyValues = {
    title: "",
    description: "",
    techStack: "",
    imageUrl: "",
    demoUrl: "",
    repoUrl: "",
    category: "",
};

const fields = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", required: true },
    {
        name: "techStack",
        label: "Tech Stack",
        type: "text",
        required: true,
        placeholder: "React, Node.js, PostgreSQL",
    },
    { name: "category", label: "Kategori", type: "text", placeholder: "Dashboard, Mobile App, dst" },
    { name: "demoUrl", label: "Demo URL", type: "text", placeholder: "https://..." },
    { name: "repoUrl", label: "Repo URL", type: "text", placeholder: "https://..." },
];

export default function ProjectForm({ initialValues, onSubmit, submitLabel = "Simpan" }) {
    const [values, setValues] = useState({ ...emptyValues, ...initialValues });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [serverError, setServerError] = useState("");
    const [uploadMessage, setUploadMessage] = useState("");
    const [previewUrl, setPreviewUrl] = useState(initialValues?.imageUrl || "");

    useEffect(() => {
        if (initialValues) {
            setValues({ ...emptyValues, ...initialValues });
            setPreviewUrl(initialValues.imageUrl || "");
        }
    }, [initialValues]);

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    function handleChange(e) {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    }

    async function handleImageChange(e) {
        const file = e.target.files?.[0];
        e.target.value = "";

        if (!file) return;

        if (file.size > 20 * 1024 * 1024) {
            setServerError("File asli terlalu besar. Maksimal 20 MB sebelum kompresi.");
            return;
        }

        const localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);
        setServerError("");
        setUploadMessage("Mengompres dan mengunggah gambar...");
        setUploading(true);

        try {
            const imageUrl = await uploadProjectImage(file);
            setValues((prev) => ({ ...prev, imageUrl }));
            setPreviewUrl(imageUrl);
            setUploadMessage("Gambar berhasil diunggah dan siap disimpan.");
        } catch (err) {
            setUploadMessage("");
            setServerError(err.response?.data?.message || err.message || "Gagal mengunggah gambar.");
            setPreviewUrl(values.imageUrl || "");
        } finally {
            setUploading(false);
            URL.revokeObjectURL(localPreview);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (uploading) return;

        const validationErrors = validateProjectForm(values);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setServerError("");
        setSubmitting(true);

        try {
            await onSubmit(values);
        } catch (err) {
            setServerError(err.response?.data?.message || "Gagal menyimpan project, coba lagi.");
        } finally {
            setSubmitting(false);
        }
    }

    const isBusy = submitting || uploading;

    return (
        <div className="grid gap-8 lg:grid-cols-2">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {fields.map((field) => (
                    <div key={field.name}>
                        <label
                            htmlFor={field.name}
                            className="mb-1 block font-mono text-xs text-text-muted"
                        >
                            {field.label}{" "}
                            {field.required && <span className="text-amber">*</span>}
                        </label>

                        {field.type === "textarea" ? (
                            <textarea
                                id={field.name}
                                name={field.name}
                                rows={4}
                                value={values[field.name]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-colors focus:border-teal"
                            />
                        ) : (
                            <input
                                id={field.name}
                                name={field.name}
                                type="text"
                                value={values[field.name]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-colors focus:border-teal"
                            />
                        )}

                        {errors[field.name] && (
                            <p className="mt-1 font-mono text-xs text-amber">{errors[field.name]}</p>
                        )}
                    </div>
                ))}

                <div>
                    <label
                        htmlFor="project-image"
                        className="mb-1 block font-mono text-xs text-text-muted"
                    >
                        Gambar Project
                    </label>
                    <input
                        id="project-image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        disabled={isBusy}
                        className="block w-full cursor-pointer rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text file:mr-4 file:rounded-full file:border-0 file:bg-amber file:px-4 file:py-2 file:font-mono file:text-xs file:font-medium file:text-ink"
                    />
                    <p className="mt-1 font-mono text-[11px] text-text-muted">
                        JPG, PNG, atau WebP · otomatis resize max 1600px dan JPEG quality 82%.
                    </p>
                    {uploadMessage && (
                        <p className="mt-1 font-mono text-xs text-teal">{uploadMessage}</p>
                    )}
                    {errors.imageUrl && (
                        <p className="mt-1 font-mono text-xs text-amber">{errors.imageUrl}</p>
                    )}
                </div>

                {serverError && (
                    <p className="rounded-lg border border-amber/40 bg-amber/10 px-3 py-2 text-xs text-amber">
                        {serverError}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isBusy}
                    className="w-full rounded-full bg-amber px-6 py-3 font-mono text-sm font-medium text-ink transition-colors hover:bg-amber/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                    {uploading ? "Mengunggah gambar..." : submitting ? "Menyimpan..." : submitLabel}
                </button>
            </form>

            <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-wider text-text-muted">
                    Preview
                </p>
                <ProjectPreviewCard values={{ ...values, imageUrl: previewUrl }} />
            </div>
        </div>
    );
}

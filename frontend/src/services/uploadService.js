import api from "@/services/api";

const MAX_WIDTH = 1600;
const JPEG_QUALITY = 0.82;
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function loadImage(file) {
    return new Promise((resolve, reject) => {
        const objectUrl = URL.createObjectURL(file);
        const image = new Image();

        image.onload = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(image);
        };

        image.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Gambar tidak bisa dibaca."));
        };

        image.src = objectUrl;
    });
}

async function compressImage(file) {
    if (!ACCEPTED_TYPES.has(file.type)) {
        throw new Error("Format gambar harus JPG, PNG, atau WebP.");
    }

    const image = await loadImage(file);
    const scale = Math.min(1, MAX_WIDTH / image.naturalWidth);
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Browser tidak mendukung pemrosesan gambar.");

    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
    );

    if (!blob) throw new Error("Gagal mengompres gambar.");

    if (blob.size > MAX_FILE_SIZE) {
        throw new Error("Gambar hasil kompresi masih terlalu besar. Pilih gambar yang lebih kecil.");
    }

    return new File([blob], "project-image.jpg", {
        type: "image/jpeg",
        lastModified: Date.now(),
    });
}

export async function uploadProjectImage(file) {
    const compressedFile = await compressImage(file);

    const signResponse = await api.post("/uploads/sign", {
        contentType: compressedFile.type,
        size: compressedFile.size,
    });

    const {
        cloudName,
        apiKey,
        timestamp,
        folder,
        publicId,
        signature,
    } = signResponse.data.data;

    const formData = new FormData()
    formData.append("file", compressedFile)
    formData.append("api_key", apiKey)
    formData.append("timestamp", String(timestamp))
    formData.append("folder", folder)
    formData.append("public_id", publicId)
    formData.append("signature", signature)

    const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload/`,
        { method: "POST", body: formData, }
    )

    const uploadData = await uploadResponse.json().catch(() => ({}))

    if (!uploadResponse.ok || !uploadData.secure_url) {
        throw new Error(
            uploadData.error?.message || "Upload gambar ke Cloudinary gagal."
        );
    }

    return uploadData.secure_url;
}

export { compressImage };

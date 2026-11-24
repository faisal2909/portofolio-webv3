import crypto from "node:crypto"

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

function getCloudinaryConfig() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        const error = new Error("Cloudinary belum dikonfigurasi di backend");
        error.statusCode = 500;
        throw error;
    }

    return { cloudName, apiKey, apiSecret };
}

function createCloudinarySignature(params, apiSecret) {
    const serializedParams = Object.entries(params)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

    return crypto
        .createHash("sha1")
        .update(`${serializedParams}${apiSecret}`)
        .digest("hex");
}

async function createSignedUpload(req, res, next) {
    try {
        const { contentType, size } = req.body;
        const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

        if (!IMAGE_TYPES.has(contentType)) {
            return res.status(400).json({
                success: false,
                message: "Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP",
            })
        }

        if (!Number.isFinite(size) || size <= 0 || size > MAX_UPLOAD_BYTES) {
            return res.status(400).json({
                success: false,
                message: "Ukuran gambar tidakvalid atau melebihi 5 MB",
            });
        }

        const timestamp = Math.floor(Date.now() / 1000)
        const folder = "portofolio/projects"
        const publicId = `project-${crypto.randomUUID()}`
        const paramsToSign = { folder, publicId, timestamp }
        const signature = createCloudinarySignature(paramsToSign, apiSecret)

        res.json({
            success: true,
            data: {
                cloudName,
                apiKey,
                timestamp,
                folder,
                publicId,
                signature,
            },
        });
    } catch (err) {
        next(err);
    }
}

export { createSignedUpload, MAX_UPLOAD_BYTES };
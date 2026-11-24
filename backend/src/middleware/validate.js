const URL_REGEX = /^https?:\/\/.+/i;

function isValidUrl(value) {
    return typeof value === "string" && URL_REGEX.test(value);
}

// dipakai di route POST & PUT /api/projects
// kalau lolos. field title/description/techstack sudah ter-trim dan siap dipakai controller
function validateProjectInput(req, res, next) {
    const { title, description, techStack, imageUrl, demoUrl, repoUrl } = req.body;
    const errors = [];

    if (!title || typeof title !== "string" || title.trim().length < 3) {
        errors.push("Title wajib diisi, minimal 3 karakter");
    }

    if (!description || typeof description !== "string" || description.trim().length < 10) {
        errors.push("Description wajib diisi, minimal 10 karakter");
    }

    if (!techStack || typeof techStack !== "string" || techStack.trim().length === 0) {
        errors.push("Tech stack wajib diisi");
    }
    if (imageUrl && !isValidUrl(imageUrl)) {
        errors.push("Image URL harus diawali http:// atau https://");
    }
    if (demoUrl && !isValidUrl(demoUrl)) {
        errors.push("Demo URL harus diawali http:// atau https://");
    }
    if (repoUrl && !isValidUrl(repoUrl)) {
        errors.push("Repo URL harus diawali http:// atau https://");
    }

    if (errors.length > 0) {
        return res.status(400).json({ success: false, message: "Validasi gagal", errors });
    }

    req.body.title = title.trim();
    req.body.description = description.trim();
    req.body.techStack = techStack.trim();

    next();
}

export { validateProjectInput, isValidUrl };
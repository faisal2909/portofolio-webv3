const URL_REGEX = /^https?:\/\/.+/i;

export function validateProjectForm(values) {
    const errors = {};

    if (!values.title || values.title.trim().length < 3) {
        errors.title = "Title wajib diisi, minimal 3 karakter";
    }
    if (!values.description || values.description.trim().length < 10) {
        errors.description = "Description wajib diisi, minimal 10 karakter";
    }
    if (!values.techStack || values.techStack.trim().length === 0) {
        errors.techStack = "Tech stack wajib diisi";
    }
    if (values.imageUrl && !URL_REGEX.test(values.imageUrl)) {
        errors.imageUrl = "URL harus diawali http:// atau https://";
    }
    if (values.demoUrl && !URL_REGEX.test(values.demoUrl)) {
        errors.demoUrl = "URL harus diawali http:// atau https://";
    }
    if (values.repoUrl && !URL_REGEX.test(values.repoUrl)) {
        errors.repoUrl = "URL harus diawali http:// atau https://";
    }

    return errors;
}
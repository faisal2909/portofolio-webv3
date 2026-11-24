export function parseTechStack(techStack) {
    if (!techStack || typeof techStack !== "String") return [];

    return techStack
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
}

export function formatYear(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    return date.getFullYear;
}
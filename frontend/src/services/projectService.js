import api from "@/services/api";

// GET /api/projects — daftar seluruh project
export async function getProjects() {
    const res = await api.get("/projects");
    return res.data.data;
}

// GET /api/projects/:id — detail satu project
export async function getProjectById(id) {
    const res = await api.get(`/projects/${id}`);
    return res.data.data;
}

// POST /api/projects — protected, hanya admin yang login
export async function createProject(payload) {
    const res = await api.post("/projects", payload);
    return res.data.data;
}

// PUT /api/projects/:id — protected
export async function updateProject(id, payload) {
    const res = await api.put(`/projects/${id}`, payload);
    return res.data.data;
}

// DELETE /api/projects/:id — protected
export async function deleteProject(id) {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
}
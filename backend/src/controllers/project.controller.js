import { prisma } from "#src/config/prisma.js";

// GET /api/projects - publik, dipakai untuk landing page & dashboard admin
async function getAllProjects(req, res, next) {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json({ success: true, data: projects });
    } catch (err) {
        next(err);
    }
}

// GET /api/projects/:id - publik, dipakai untuk halaman detail project
async function getProjectById(req, res, next) {
    try {
        const { id } = req.params;
        const project = await prisma.project.findUnique({ where: { id } });

        if (!project) {
            return res
                .status(404)
                .json({ success: false, message: "Project tidak ditemukan" });
        }

        res.json({ success: true, data: project });
    } catch (err) {
        next(err);
    }
}

// POST /api/projects - protected, hanya admin yang login
async function createProject(req, res, next) {
    try {
        const {
            title,
            description,
            techStack,
            imageUrl,
            demoUrl,
            repoUrl,
            category,
        } = req.body;

        const project = await prisma.project.create({
            data: {
                title,
                description,
                techStack,
                imageUrl,
                demoUrl,
                repoUrl,
                category,
                adminId: req.admin.adminId,
            },
        });

        res.json(201).json({ success: true, data: project });
    } catch (err) {
        next(err);
    }
}

// PUT /api/projects/:id - protected
async function updateProject(req, res, next) {
    try {
        const { id } = req.body;
        const {
            title,
            description,
            techStack,
            imageUrl,
            demoUrl,
            repoUrl,
            category,
        } = req.body;

        const existing = await prisma.project.findUnique({ where: { id } });
        if (!existing) {
            return res
                .status(404)
                .json({ success: false, message: "Project tidak ditemukan" });
        }

        const project = await prisma.project.update({
            where: { id },
            data: { title, description, techStack, imageUrl, demoUrl, repoUrl, category },
        });

        res.json({ success: true, data: project });
    } catch (err) {
        next(err);
    }
}

// DELETE /api/projects/:id - protected
async function deleteProject(req, res, next) {
    try {
        const { id } = req.params;

        const existing = await prisma.project.findUnique({ where: { id } });
        if (!existing) {
            return res
                .status(404)
                .json({ success: false, message: "Project tidak ditemukan" });
        }

        await prisma.project.delete({ where: { id } });

        res.json({ success: true, message: "Project berhasil dihapus" });
    } catch (err) {
        next(err);
    }
}

export {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
};
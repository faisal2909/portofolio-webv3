import express from "express";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import authRoutes from "#src/routes/auth.routes.js";
import projectRoutes from "#src/routes/project.routes.js";
import uploadRoutes from "#src/routes/upload.routes.js";

const app = express();

app.use(helmet());
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);

app.use(express.json());

// health check - untuk memastikan server & deployment berjalan
app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "Portofolio API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/uploads", uploadRoutes);

// 404 handler - untuk endpoint yang tidak terdaftar
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Endpoint tidak ditemukan" })
})

// error handler global - menangkap error yang dilempar dari controller/middleware
app.use((err, req, res, next) => {
    console.error(err);

    // prisma: pelanggaran unique constraint (misal email admin duplikat)
    if (err.code === "P2002") {
        const field = err.meta?.target?.join(", " || "data ini");
        return res.status(409).json({
            success: false,
            message: `Data dengan ${field} sudah terdaftar`,
        });
    }

    // prisma: record yang dicari tidak ditemukan saat update/delete
    if (err.code === "P2025") {
        return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Terjadi kesalahan pada server",
    })
})

export default app;
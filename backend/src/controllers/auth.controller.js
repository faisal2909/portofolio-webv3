import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "#src/config/prisma.js";

async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "Email dan password wajib diisi" });
        }

        const admin = await prisma.admin.findUnique({ where: { email } });

        if (!admin) {
            return res
                .status(401)
                .json({ success: false, message: "Email atau password salah" });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ success: false, message: "Email atau password salah" });
        }

        const token = jwt.sign(
            { adminId: admin.id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        res.json({
            success: true,
            data: {
                token,
                admin: { id: admin.id, username: admin.username, email: admin.email },
            },
        })
    } catch (err) {
        next(err);
    }
}

// dipakai frontend untuk cek apakah token admin masih valid
async function me(req, res, next) {
    try {
        const admin = await prisma.admin.findUnique({
            where: { id: req.admin.adminId },
            select: { id: true, username: true, email: true, createdAt: true },
        });

        if (!admin) {
            return res
                .status(404)
                .json({ success: false, message: "Admin tidak ditemukan" });
        }

        res.json({ success: true, data: admin });
    } catch (err) {
        next(err);
    }
}

export { login, me };
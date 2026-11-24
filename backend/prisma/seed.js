import dotenv from "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/config/prisma.js";

async function main() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const username = process.env.ADMIN_USERNAME || "Admin";

    if (!email || !password) {
        throw new Error("ADMIN_EMAIL dan ADMIN_PASSWORD wajib diisi di .env sebelum menjalankan seed");
    }

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
        console.log(`Admin dengan email ${email} sudah ada, seeding dilewati.`);
        return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
        data: { username, email, passwordHash },
    });

    console.log(`Admin berhasil dibuat: ${admin.email}`);
}

main()
    .catch((err) => {
        console.log("Gagal menjalankan seed:", err.message);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
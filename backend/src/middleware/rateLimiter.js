import rateLimit from "express-rate-limit";

// Maksimal 10 percobaan login per IP setiap 15 menit.
// Cukup untuk mencegah brute force dasar tanpa mengganggu pemakaian normal
// (single admin, jarang salah ketik password lebih dari beberapa kali)

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Terlalu banyak percobaan login, coba lagi dalam beberapa menit",
    },
});

export default loginLimiter;
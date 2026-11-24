import jwt from 'jsonwebtoken';

// melindungi route yang butuh login admin
// cek header: authorization: bearer <toker>
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Token tidak ditemukan, silahkan login terlebih dahulu",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // payload token (adminId, email)
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Token tidak valid atau sudah kadaluwarsa",
        });
    }
}

export default verifyToken;
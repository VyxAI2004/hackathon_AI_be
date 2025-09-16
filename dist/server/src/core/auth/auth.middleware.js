"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const auth_utils_1 = require("./auth.utils");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: Missing or invalid token" });
    }
    const token = authHeader.slice(7);
    try {
        const decoded = (0, auth_utils_1.verifyToken)(token);
        if (!decoded || typeof decoded === 'string' || !decoded.id) {
            return res.status(403).json({ message: "Forbidden: Invalid token payload" });
        }
        req.user = decoded;
        next();
    }
    catch (err) {
        console.error("Token verify error:", err);
        return res.status(403).json({ message: "Forbidden: Token is invalid or expired" });
    }
};
exports.authMiddleware = authMiddleware;

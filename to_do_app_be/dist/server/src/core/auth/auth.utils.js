"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = void 0;
// auth.util.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Lấy biến môi trường và xử lý lỗi ngay từ đầu
exports.JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
// Sử dụng parseInt() để chuyển đổi giá trị từ string sang number
exports.JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN, 10) || 3600;
if (!exports.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
}
// Sign token
const signToken = (payload) => {
    const options = {
        expiresIn: exports.JWT_EXPIRES_IN,
        algorithm: "HS256",
    };
    return jsonwebtoken_1.default.sign(payload, exports.JWT_SECRET, options);
};
exports.signToken = signToken;
// Verify token
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, exports.JWT_SECRET);
};
exports.verifyToken = verifyToken;

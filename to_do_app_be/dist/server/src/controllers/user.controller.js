"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const auth_utils_1 = require("../core/auth/auth.utils");
class UserController {
    constructor(service) {
        this.service = service;
    }
    async getByEmail(req, res) {
        const user = await this.service.getByEmail(req.params.email);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.json(user);
    }
    async login(req, res) {
        const { email, password } = req.body;
        const user = await this.service.login(email, password);
        if (!user)
            return res.status(401).json({ message: "Invalid email or password" });
        // Tạo access_token
        const access_token = (0, auth_utils_1.signToken)({ id: user.id, email: user.email, username: user.username });
        // Nếu muốn, có thể tạo refresh_token riêng
        const refresh_token = (0, auth_utils_1.signToken)({ id: user.id, type: "refresh" });
        // Lấy expires_in từ env (chuỗi, cần chuyển sang giây nếu FE cần số)
        const expires_in = auth_utils_1.JWT_EXPIRES_IN;
        const { passwordHash, ...safeUser } = user;
        res.json({ access_token, refresh_token, expires_in, user: safeUser });
    }
    async refreshToken(req, res) {
        const { refresh_token } = req.body;
        if (!refresh_token)
            return res.status(400).json({ message: "Refresh token is required" });
        try {
            const decoded = (0, auth_utils_1.verifyToken)(refresh_token);
            if (decoded.type !== "refresh") {
                return res.status(401).json({ message: "Invalid refresh token" });
            }
            const user = await this.service.getUser(decoded.id);
            if (!user)
                return res.status(404).json({ message: "User not found" });
            // Tạo access token mới
            const access_token = (0, auth_utils_1.signToken)({ id: user.id, email: user.email, username: user.username });
            const expires_in = auth_utils_1.JWT_EXPIRES_IN;
            res.json({ access_token, expires_in });
        }
        catch (err) {
            return res.status(401).json({ message: "Refresh token expired or invalid" });
        }
    }
    // --- LOGOUT ---
    async logout(req, res) {
        const { refresh_token } = req.body;
        // Nếu server lưu refresh token, xoá token khỏi DB/cache
        // await this.service.revokeRefreshToken(refresh_token);
        // Nếu không lưu trên server, chỉ cần client xoá là được
        res.json({ message: "Logged out successfully" });
    }
    async getUser(req, res) {
        const user = await this.service.getUser(req.params.id);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const { passwordHash, ...safeUser } = user;
        res.json(safeUser);
    }
    async search(req, res) {
        const users = await this.service.search(req.query);
        const safeUsers = users.map(({ passwordHash, ...safeUser }) => safeUser);
        res.json({ users: safeUsers, total: safeUsers.length });
    }
    async createUser(req, res) {
        const user = await this.service.createUser(req.body);
        const { passwordHash, ...safeUser } = user;
        res.status(201).json(safeUser);
    }
    async updateUser(req, res) {
        const user = await this.service.updateUser(req.params.id, req.body);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const { passwordHash, ...safeUser } = user;
        res.json(safeUser);
    }
    async deleteUser(req, res) {
        const ok = await this.service.deleteUser(req.params.id);
        if (!ok)
            return res.status(404).json({ message: "User not found" });
        res.status(204).send();
    }
}
exports.UserController = UserController;

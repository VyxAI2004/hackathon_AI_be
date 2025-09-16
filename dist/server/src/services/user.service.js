"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const base_service_1 = require("./base.service");
const security_1 = require("../core/security");
class UserService extends base_service_1.BaseService {
    constructor(repo) {
        super(repo);
        this.repo = repo;
    }
    // Chức năng lấy user theo email
    async getByEmail(email) {
        return this.repo.getByEmail(email);
    }
    // Chức năng lấy user theo ID
    async getUser(userId) {
        return this.get(userId);
    }
    async login(email, password) {
        return this.repo.login(email, password);
    }
    // Chức năng tìm kiếm user với các bộ lọc
    async search(filters, skip = 0, limit = 100) {
        return this.repo.search(filters, skip, limit);
    }
    // Chức năng tạo user mới
    async createUser(payload) {
        const password = payload.password;
        if (!password) {
            throw new Error("Password is required");
        }
        const hashedPassword = await (0, security_1.hashPassword)(password);
        const userPayload = { ...payload, passwordHash: hashedPassword };
        delete userPayload.password; // Xóa trường password gốc
        return this.create(userPayload);
    }
    // Chức năng cập nhật thông tin user
    async updateUser(userId, payload) {
        const dbUser = await this.get(userId);
        if (!dbUser) {
            return null;
        }
        if (payload.password) {
            const hashedPassword = await (0, security_1.hashPassword)(payload.password);
            payload.passwordHash = hashedPassword;
            delete payload.password;
        }
        return this.update(userId, payload);
    }
    // Chức năng xóa user
    async deleteUser(userId) {
        return this.delete(userId);
    }
    // Chức năng đếm số lượng user theo bộ lọc
    async countUsers(filters) {
        return this.repo.countCurrents(filters);
    }
}
exports.UserService = UserService;

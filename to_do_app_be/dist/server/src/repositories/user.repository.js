"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const typeorm_1 = require("typeorm");
const base_repository_1 = require("./base.repository");
class UserRepository extends base_repository_1.BaseRepository {
    constructor(repo) {
        super(repo);
    }
    async search(filters, skip = 0, limit = 100) {
        const whereClause = [];
        if (filters) {
            if (filters.q) {
                whereClause.push({ username: (0, typeorm_1.Like)(`%${filters.q}%`) }, { email: (0, typeorm_1.Like)(`%${filters.q}%`) });
            }
            if (filters.username) {
                whereClause.push({ username: (0, typeorm_1.Like)(`%${filters.username}%`) });
            }
            if (filters.email) {
                whereClause.push({ email: (0, typeorm_1.Like)(`%${filters.email}%`) });
            }
        }
        return this.repo.find({
            where: whereClause,
            skip,
            take: limit,
            order: { created_at: "DESC" },
        });
    }
    async getByEmail(email) {
        return this.repo.findOne({ where: { email } });
    }
    async login(email, password) {
        const user = await this.repo.findOne({ where: { email } });
        if (!user) {
            return null;
        }
        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return null;
        }
        return user;
    }
    async countCurrents(filters) {
        const whereClause = [];
        if (filters) {
            if (filters.q) {
                whereClause.push({ username: (0, typeorm_1.Like)(`%${filters.q}%`) }, { email: (0, typeorm_1.Like)(`%${filters.q}%`) });
            }
            if (filters.username) {
                whereClause.push({ username: (0, typeorm_1.Like)(`%${filters.username}%`) });
            }
            if (filters.email) {
                whereClause.push({ email: (0, typeorm_1.Like)(`%${filters.email}%`) });
            }
        }
        return this.repo.count({ where: whereClause });
    }
}
exports.UserRepository = UserRepository;

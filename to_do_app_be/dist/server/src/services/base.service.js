"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    constructor(repo) {
        this.repo = repo;
    }
    async get(id) {
        return this.repo.get(id);
    }
    async getMulti(skip = 0, limit = 100, filters) {
        return this.repo.getMulti(skip, limit, filters);
    }
    async create(payload) {
        return this.repo.create(payload);
    }
    async update(id, payload) {
        return this.repo.update(id, payload);
    }
    async delete(id) {
        return await this.repo.delete(id);
    }
}
exports.BaseService = BaseService;

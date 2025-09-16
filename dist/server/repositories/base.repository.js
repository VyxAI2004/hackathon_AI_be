"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(repo) {
        this.repo = repo;
    }
    get manager() {
        return this.repo.manager;
    }
    async get(id) {
        return await this.repo.findOneBy({ id });
    }
    async getMulti(skip = 0, limit = 100, filters) {
        return await this.repo.find({
            where: filters,
            skip,
            take: limit,
        });
    }
    async create(payload) {
        const entity = this.repo.create(payload);
        return await this.repo.save(entity);
    }
    async update(id, payload) {
        await this.repo.update(id, payload);
        return this.get(id);
    }
    async delete(id) {
        const result = await this.repo.delete(id);
        return !!result.affected && result.affected > 0;
    }
}
exports.BaseRepository = BaseRepository;
